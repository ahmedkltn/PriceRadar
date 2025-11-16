import os
import re
import time
from contextlib import contextmanager
from datetime import datetime
from typing import List, Dict, Optional
import pandas as pd

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type

load_dotenv()


HEADLESS = os.getenv("SCRAPER_HEADLESS", "true").lower() == "true"
TIMEOUT_MS = int(os.getenv("SCRAPER_TIMEOUT_MS", "30000"))

PG_USER = os.getenv("POSTGRES_USER", "admin")
PG_PASS = os.getenv("POSTGRES_PASSWORD", "admin")
PG_HOST = os.getenv("POSTGRES_HOST", "postgres")
PG_PORT = os.getenv("POSTGRES_PORT", "5432")
PG_DB   = os.getenv("POSTGRES_DB", "priceradar")

DB_URL = f"postgresql+psycopg2://{PG_USER}:{PG_PASS}@{PG_HOST}:{PG_PORT}/{PG_DB}"

_engine = create_engine(DB_URL, pool_pre_ping=True)


def to_float_price(s: str) -> (Optional[float], Optional[str]):  # type: ignore
    """
    Convert messy price strings into float + currency code.
    Handles:
      - narrow no-break spaces (\u202f)
      - non-breaking spaces (\xa0)
      - commas as decimal separators
      - thousands separators
      - various currency formats
    """
    if not s:
        return None, None

    raw = s.strip()

    # --- Detect currency ---
    curr = None
    m_curr = re.search(r'(TND|DT|USD|EUR|€|\$|£)', raw, re.IGNORECASE)
    if m_curr:
        curr = (
            m_curr.group(1)
            .upper()
            .replace("€", "EUR")
            .replace("$", "USD")
            .replace("£", "GBP")
        )
        if curr == "DT":
            curr = "TND"

    # --- Clean weird spaces ---
    cleaned = (
        raw.replace(" ", "")
            .replace("\u202f", "")
            .replace("\xa0", "")
            .replace("\u00A0", "")
    )

    # --- Extract the numeric portion ---
    m_num = re.search(r'[\d][\d.,]*', cleaned)
    if not m_num:
        return None, curr or "TND"
    num = m_num.group(0)

    # --- Normalize decimal/thousand separators ---
    if "," in num and "." in num:
        # If last '.' is after last ',' → '.' is decimal separator (remove ',')
        if num.rfind(".") > num.rfind(","):
            num = num.replace(",", "")
        else:
            # ',' is decimal → remove thousands '.' and convert ',' → '.'
            num = num.replace(".", "").replace(",", ".")
    elif "," in num:
        # Only commas → decimal
        num = num.replace(",", ".")

    # --- Convert ---
    try:
        return float(num), curr or "TND"
    except Exception:
        return None, curr or "TND"

@contextmanager
def playwright_page(browser_type="chromium", headless=HEADLESS):
    """
    Context manager that yields a ready-to-use Playwright page.
    Auto-closes browser on exit.
    """
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = getattr(p, browser_type).launch(headless=headless)
        page = browser.new_page(
            user_agent=("Mozilla/5.0 (X11; Linux x86_64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/126.0 Safari/537.36"),
            viewport={"width": 1280, "height": 2000}
        )
        try:
            yield page
        finally:
            browser.close()

def soup_from_page(page) -> BeautifulSoup:
    """Convert a Playwright page’s HTML into a BeautifulSoup object."""
    html = page.content()
    return BeautifulSoup(html, "html.parser")


def save_raw_to_db(df_c: pd.DataFrame, table: str = "raw.scraped_products"):
    """
    Insert a DataFrame of scraped rows into Postgres.
    Expected columns: product_name, price_raw, price_value, currency,
                      vendor, url, category, scraped_at
    """
    if df_c.empty:
        print("No data to insert.")
        return

    required_cols = [
        "product_name", "price_raw", "price_value", "currency","image_url",
        "vendor", "url", "category", "scraped_at"
    ]
    for c in required_cols:
        if c not in df_c.columns:
            df_c[c] = None

    records = df_c[required_cols].to_dict(orient="records")
    with _engine.begin() as conn:
        conn.execute(
            text(f"""
                INSERT INTO {table}
                (product_name, price_raw, price_value, currency, vendor, url, category, scraped_at, image_url)
                VALUES (:product_name, :price_raw, :price_value, :currency, :vendor, :url, :category, :scraped_at, :image_url)
            """), records
        )
    print(f"Inserted {len(records)} rows into {table}")


def backoff(base=0.5, jitter=0.3):
    """Sleep a bit between page loads to avoid anti-bot detection."""
    import random
    t = base + random.uniform(0, jitter)
    time.sleep(t)

# Example retry wrapper if you want for unstable sites:
@retry(stop=stop_after_attempt(3), wait=wait_fixed(2),
       retry=retry_if_exception_type(Exception))
def goto_with_retry(page, url: str, timeout: int = 60000):
    """Retry page.goto on occasional network timeouts."""
    return page.goto(url, timeout=timeout)



def fmt_eta(elapsed_s: float, done: int, total: int) -> str:
    if done <= 0 or total <= 0 or done > total:
        return "--:--"
    rate = elapsed_s / done
    remaining = rate * (total - done)
    m, s = divmod(int(remaining), 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{s:02d}"
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from ..utils import playwright_page, soup_from_page, to_float_price, backoff, fmt_eta, save_raw_to_db
import time

import argparse

BASE = "https://www.mytek.tn/"



def get_category_links() -> list[str]:
    with playwright_page() as page:
        page.goto(BASE, timeout=60000)
        page.wait_for_selector("li.category-item a", state="attached", timeout=30000)
        soup = soup_from_page(page)
        links = []
        for a in soup.select("li.category-item a[href]"):
            href = (a.get("href") or "").strip()
            if not href or href in ("#", "#0") or href.lower().startswith("javascript:"):
                continue
            if href.startswith("/"):
                href = BASE + href
            # Only keep category/catalog URLs
            if "mytek.tn" in href and "/catalogsearch/" not in href and "/customer/" not in href:
                links.append(href)
        links = sorted(set(links))
        print(f"[Mytek] Found {len(links)} category links")
        return links

def scrape_category_page(category_url: str, max_pages: int | None = None):
    all_products = []
    with playwright_page() as page:
        # Go to the category first, then detect pagination
        page.goto(category_url, timeout=60000)
        try:
            soup_pg = soup_from_page(page)
            nums = []
            for a in soup_pg.select("li.page-item a"):
                t = (a.get_text(strip=True) or "").strip()
                if t.isdigit():
                    nums.append(int(t))
            max_page_detected = max(nums) if nums else 1
        except Exception:
            max_page_detected = 1
        # Cap pages if a max_pages limit is provided
        max_page = min(max_page_detected, max_pages) if isinstance(max_pages, int) and max_pages > 0 else max_page_detected

        started = time.time()
        for p in range(1, max_page + 1):
            # Some Mytek pages use ?p=, others ?page=. Try ?p= first, then fallback.
            url = f"{category_url}{'&' if '?' in category_url else '?'}p={p}"
            elapsed = time.time() - started
            print(f"[Mytek] Category page {p}/{max_page} ETA {fmt_eta(elapsed, p, max_page)} → {url}")
            page.goto(url, timeout=60000)
            page.wait_for_selector("div.product-container", timeout=30000)
            soup = soup_from_page(page)
            for div in soup.select("div.product-container"):
                name_tag = div.select_one("h2.product-item-name a")
                price_tag = (
                    div.select_one("span.final-price")
                    or div.select_one("span.price")
                    or div.select_one(".price-wrapper .price")
                )
                if name_tag and price_tag:
                    product_name = name_tag.get_text(strip=True)
                    price_raw = price_tag.get_text(strip=True)
                    price_value, currency = to_float_price(price_raw)
                    product_url = name_tag.get("href")
                    if product_url and product_url.startswith("/"):
                        product_url = BASE + product_url
                    all_products.append({
                        "product_name": product_name,
                        "price_raw": price_raw,
                        "price_value": price_value,
                        "currency": currency or "TND",
                        "vendor": "Mytek",
                        "url": product_url,
                        "scraped_at": datetime.now()
                    })
            backoff()
    df_c = pd.DataFrame(all_products)
    print(f"[Mytek] Scraped {len(df_c)} products from {category_url}")
    return df_c


def scrape_mytek_all_categories(max_pages: int = 3, max_cats: int | None = None):
    all_links = get_category_links()
    total_found = len(all_links)
    if isinstance(max_cats, int) and max_cats > 0:
        all_links = all_links[:max_cats]
    print(f"Found {total_found} categories. Taking {len(all_links)} for this run.")
    started = time.time()
    total_cats = len(all_links)
    all_products = []
    for i, cat in enumerate(all_links, start=1):
        elapsed = time.time() - started
        print(f"[Mytek] Category {i}/{total_cats} ETA {fmt_eta(elapsed, i, total_cats)} → {cat}")
        df_c = scrape_category_page(cat, max_pages)
        df_c["category"] = cat
        all_products.append(df_c)
    return pd.concat(all_products, ignore_index=True)


# CLI entry point
def main():
    parser = argparse.ArgumentParser(description="Mytek scraper runner")
    parser.add_argument("--mode", choices=["categories", "category"], default="categories",
                        help="Run all discovered categories or a single category URL")
    parser.add_argument("--category_url", help="Specific Mytek category URL when --mode=category")
    parser.add_argument("--max_pages", type=int, default=3, help="Max pages per category to scrape")
    parser.add_argument("--dry", action="store_true", help="Do not write to DB; just print a preview")
    parser.add_argument("--to_json", help="Optional path to save results as JSON")
    parser.add_argument("--max_cats", type=int, default=None, help="Limit number of categories to process (for testing)")
    args = parser.parse_args()

    if args.mode == "category":
        if not args.category_url:
            raise SystemExit("--category_url is required when --mode=category")
        df_c = scrape_category_page(args.category_url, max_pages=args.max_pages)
        df_c["category"] = args.category_url
    else:
        df_c = scrape_mytek_all_categories(max_pages=args.max_pages, max_cats=args.max_cats)

    # Output / persistence
    if args.dry:
        print(df_c.head(20))
        print(f"\n[DRY] Total rows: {len(df_c)}")
    else:
        try:
            save_raw_to_db(df_c)
        except Exception as e:
            print(f"Failed to write to DB: {e}")

    if args.to_json:
        try:
            df_c.to_json(args.to_json, orient="records", indent=2, force_ascii=False)
            print(f"Saved JSON → {args.to_json}")
        except Exception as e:
            print(f"Failed to save JSON: {e}")


if __name__ == "__main__":
    main()
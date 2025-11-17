import pandas as pd
from datetime import datetime
from scripts.utils_pkg import playwright_page, soup_from_page, to_float_price, backoff, fmt_eta, save_raw_to_db
import time
import logging
import argparse

logger = logging.getLogger(__name__)

BASE = "https://www.tunisianet.com.tn"

top_categories = [
    "https://www.tunisianet.com.tn/301-pc-portable-tunisie",
    "https://www.tunisianet.com.tn/377-telephone-portable-tunisie",
    "https://www.tunisianet.com.tn/665-televiseurs"
]


def get_category_links() -> list[str]:
    """Scrape all Tunisianet category links"""
    logger.info("Fetching Tunisianet category links...")

    with playwright_page() as page:
        page.goto(BASE, timeout=60000)
        # menu items
        page.wait_for_selector("li[class*='menu-item'] a", timeout=30000)
        soup = soup_from_page(page)

        links: list[str] = []
        for a in soup.select("li[class*='menu-item'] a[href]"):
            href = (a.get("href") or "").strip()
            if not href or href in ("#", "#0"):
                continue

            if href.startswith("/"):
                href = BASE + href

            if "tunisianet.com.tn" in href:
                links.append(href)

        links = sorted(set(links))
        logger.info(f"Found {len(links)} category links on Tunisianet")
        return links


def scrape_category_page(category_url: str, max_pages: int | None = None):
    """Scrape products from a single Tunisianet category using rel='next' pagination"""
    logger.info(f"Scraping Tunisianet category: {category_url}")
    all_products: list[dict] = []

    with playwright_page() as page:
        page.goto(category_url, timeout=60000)
        started = time.time()
        page_idx = 1

        while True:
            elapsed = time.time() - started
            total_for_eta = max_pages if isinstance(max_pages, int) and max_pages > 0 else page_idx
            logger.info(
                f"Page {page_idx}/{total_for_eta} | ETA {fmt_eta(elapsed, page_idx, total_for_eta)} | {page.url}"
            )

            # Wait for products
            page.wait_for_selector("div.item-product", timeout=30000)
            # Optional: wait a bit for prices to load properly
            try:
                page.wait_for_function(
                    """
                    () => {
                      const els = Array.from(
                        document.querySelectorAll('span.price')
                      );
                      return els.some(e => {
                        const t = (e.textContent || '').trim();
                        return t && t !== '\\xa0';
                      });
                    }
                    """,
                    timeout=8000,
                )
            except Exception:
                logger.debug("Price text may not be fully loaded; continuing with current DOM snapshot.")

            soup = soup_from_page(page)
            page_products = 0

            for prod in soup.select("div.item-product"):
                # Title
                title_tag = prod.select_one("h2.product-title")
                if not title_tag:
                    continue
                product_name = title_tag.get_text(strip=True)

                # Price
                price_tag = prod.select_one("span.price")
                price_raw = price_tag.get_text(strip=True) if price_tag else None
                price_value, currency = to_float_price(price_raw or "")

                # Image
                img_tag = prod.select_one("a.first-img img")
                image_url = img_tag.get("src") if img_tag else None

                # Product URL
                url_tag = prod.select_one("h2.product-title a")
                product_url = url_tag.get("href") if url_tag else None
                if product_url and product_url.startswith("/"):
                    product_url = BASE + product_url

                all_products.append(
                    {
                        "product_name": product_name,
                        "price_raw": price_raw,
                        "price_value": price_value,
                        "image_url": image_url,
                        "currency": currency or "TND",
                        "vendor": "Tunisianet",
                        "url": product_url,
                        "scraped_at": datetime.now(),
                    }
                )
                page_products += 1

            logger.debug(f"  └─ Extracted {page_products} products from page {page_idx}")
            backoff()

            # Stop if we reached max_pages
            if isinstance(max_pages, int) and max_pages > 0 and page_idx >= max_pages:
                break

            # Check for next page via rel='next'
            try:
                next_btn = page.query_selector("a[rel='next']")
            except Exception:
                next_btn = None

            if not next_btn:
                logger.info("No next page link found; stopping pagination.")
                break

            try:
                next_btn.click()
                page.wait_for_load_state("networkidle", timeout=60000)
            except Exception as e:
                logger.warning(f"Failed to navigate to next page, stopping pagination: {e}")
                break

            page_idx += 1

    df_c = pd.DataFrame(all_products)
    logger.info(f"Scraped {len(df_c)} total products from category")
    return df_c


def scrape_tunisianet_all_categories(max_pages: int = 3, max_cats: int | None = None):
    """Scrape all (filtered) categories from Tunisianet with optional limits"""
    logger.info("=" * 60)
    logger.info("Starting full Tunisianet scrape")
    logger.info(f"Parameters: max_pages={max_pages}, max_cats={max_cats}")
    logger.info("=" * 60)

    all_links = get_category_links()
    total_found = len(all_links)

    # Filter for top categories only
    filtered_links = [
        link for link in all_links
        if any(tc.lower() in link.lower() for tc in top_categories)
    ]
    logger.info(f"Found {total_found} categories. Filtered down to {len(filtered_links)} top categories.")

    all_links = filtered_links

    if isinstance(max_cats, int) and max_cats > 0:
        all_links = all_links[:max_cats]
        logger.info(f"Limited to {len(all_links)} categories for this run.")

    started = time.time()
    total_cats = len(all_links)
    all_products = []

    for i, cat in enumerate(all_links, start=1):
        elapsed = time.time() - started
        logger.info("")
        logger.info(f"{'=' * 60}")
        logger.info(f"Category {i}/{total_cats} | ETA {fmt_eta(elapsed, i, total_cats)}")
        logger.info(f"URL: {cat}")
        logger.info(f"{'=' * 60}")

        try:
            df_c = scrape_category_page(cat, max_pages)
            df_c["category"] = cat
            all_products.append(df_c)
            logger.info(f"Category {i}/{total_cats} complete: {len(df_c)} products")
        except Exception as e:
            logger.error(f"Failed to scrape category {i}/{total_cats}: {cat}", exc_info=True)
            continue

    if not all_products:
        logger.warning("No products scraped from any Tunisianet category!")
        return pd.DataFrame()

    final_df = pd.concat(all_products, ignore_index=True)
    logger.info("")
    logger.info("=" * 60)
    logger.info("SCRAPING COMPLETE!")
    logger.info(f"Total products scraped: {len(final_df)}")
    logger.info(f"Total time: {time.time() - started:.1f}s")
    logger.info("=" * 60)

    return final_df


def main():
    """Command-line interface for the Tunisianet scraper"""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    parser = argparse.ArgumentParser(description="Tunisianet scraper runner")
    parser.add_argument(
        "--mode",
        choices=["categories", "category"],
        default="categories",
        help="Run all discovered categories or a single category URL",
    )
    parser.add_argument("--category_url", help="Specific Tunisianet category URL when --mode=category")
    parser.add_argument("--max_pages", type=int, default=3, help="Max pages per category to scrape")
    parser.add_argument("--dry", action="store_true", help="Do not write to DB; just print a preview")
    parser.add_argument("--to_json", help="Optional path to save results as JSON")
    parser.add_argument("--max_cats", type=int, default=None, help="Limit number of categories to process (for testing)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose (DEBUG) logging")
    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
        logger.setLevel(logging.DEBUG)

    logger.info("Starting Tunisianet scraper CLI")
    logger.info(f"Mode: {args.mode}")

    if args.mode == "category":
        if not args.category_url:
            logger.error("--category_url is required when --mode=category")
            raise SystemExit("--category_url is required when --mode=category")
        df_c = scrape_category_page(args.category_url, max_pages=args.max_pages)
        df_c["category"] = args.category_url
    else:
        df_c = scrape_tunisianet_all_categories(max_pages=args.max_pages, max_cats=args.max_cats)

    if args.dry:
        logger.info("DRY RUN - Not saving to database")
        logger.info(f"\n{df_c.head(20)}")
        logger.info(f"\nTotal rows: {len(df_c)}")
    else:
        try:
            logger.info("Saving results to database...")
            save_raw_to_db(df_c)
            logger.info("Successfully saved to database")
        except Exception as e:
            logger.error(f"Failed to write to DB: {e}", exc_info=True)

    if args.to_json:
        try:
            df_c.to_json(args.to_json, orient="records", indent=2, force_ascii=False)
            logger.info(f"Saved JSON → {args.to_json}")
        except Exception as e:
            logger.error(f"Failed to save JSON: {e}", exc_info=True)


if __name__ == "__main__":
    main()
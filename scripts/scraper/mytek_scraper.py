import pandas as pd
from datetime import datetime
from scripts.utils_pkg import playwright_page, soup_from_page, to_float_price, backoff, fmt_eta, save_raw_to_db
import time
import logging
import argparse
# Set up logger
logger = logging.getLogger(__name__)

BASE = "https://www.mytek.tn/"

top_categories = [
    "https://www.mytek.tn/informatique/ordinateurs-portables/pc-portable.html",
    "https://www.mytek.tn/informatique/ordinateurs-portables/mac.html",
    "https://www.mytek.tn/telephonie-tunisie/smartphone-mobile-tunisie/telephone-portable.html",
    "https://www.mytek.tn/telephonie-tunisie/smartphone-mobile-tunisie/iphone.html"
]


def get_category_links() -> list[str]:
    """Scrape all category links from Mytek homepage"""
    logger.info("Starting to fetch category links from Mytek...")
    
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
        logger.info(f"Found {len(links)} category links from Mytek")
        return links


def scrape_category_page(category_url: str, max_pages: int | None = None):
    """Scrape products from a single category page with pagination"""
    logger.info(f"Scraping category: {category_url}")
    all_products = []
    
    with playwright_page() as page:
        # Go to the category first, then detect pagination (do not wait for price text here)
        page.goto(category_url, timeout=60000)
        try:
            soup_pg = soup_from_page(page)
            nums = []
            for a in soup_pg.select("li.page-item a"):
                t = (a.get_text(strip=True) or "").strip()
                if t.isdigit():
                    nums.append(int(t))
            max_page_detected = max(nums) if nums else 1
            logger.debug(f"Detected {max_page_detected} pages for category")
        except Exception as e:
            logger.warning(f"Could not detect pagination, defaulting to 1 page: {e}")
            max_page_detected = 1

        # Cap pages if a max_pages limit is provided
        max_page = min(max_page_detected, max_pages) if isinstance(max_pages, int) and max_pages > 0 else max_page_detected
        logger.info(f"Will scrape {max_page} pages (detected: {max_page_detected}, limit: {max_pages})")

        started = time.time()
        for p in range(1, max_page + 1):
            # Some Mytek pages use ?p=, others ?page=. Try ?p= first, then fallback.
            url = f"{category_url}{'&' if '?' in category_url else '?'}p={p}"
            elapsed = time.time() - started
            logger.info(f"Page {p}/{max_page} | ETA {fmt_eta(elapsed, p, max_page)} | {url}")

            page.goto(url, timeout=60000)
            page.wait_for_selector("div.product-container", timeout=30000)
            # Try to wait for price text to actually load (avoid '\xa0'), but don't fail hard
            try:
                page.wait_for_function(
                    """
                    () => {
                      const els = Array.from(
                        document.querySelectorAll('span.final-price, span.price, .price-wrapper .price')
                      );
                      return els.some(e => {
                        const t = (e.textContent || '').trim();
                        return t && t !== '\\xa0';
                      });
                    }
                    """,
                    timeout=10000
                )
            except Exception:
                logger.debug("Price text did not fully load before timeout; continuing with current DOM snapshot.")
            soup = soup_from_page(page)

            page_products = 0
            for div in soup.select("div.product-container"):
                name_tag = div.select_one("h1.product-item-name a")
                price_tag = (
                    div.select_one("span.final-price")
                    or div.select_one("span.price")
                    or div.select_one(".price-wrapper .price")
                )
                img_url = div.select_one("img[id*='seImgProduct']")
                img_url_value = img_url.get("src") if img_url else None

                # Brand (logo & name)
                brand_tag = div.select_one("div.brand img")
                brand_name = brand_tag.get("alt") if brand_tag else None
                brand_image = brand_tag.get("src") if brand_tag else None

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
                        "image_url": img_url_value,
                        "brand_name": brand_name,
                        "brand_image": brand_image,
                        "currency": currency or "TND",
                        "vendor": "Mytek",
                        "url": product_url,
                        "scraped_at": datetime.now()
                    })
                    page_products += 1

            logger.debug(f"  └─ Extracted {page_products} products from page {p}")
            backoff()
    
    df_c = pd.DataFrame(all_products)
    logger.info(f"Scraped {len(df_c)} total products from category")
    return df_c


def scrape_mytek_all_categories(max_pages: int = 3, max_cats: int | None = None):
    """Scrape all categories from Mytek with optional limits"""
    logger.info("="*60)
    logger.info("Starting full Mytek scrape")
    logger.info(f"Parameters: max_pages={max_pages}, max_cats={max_cats}")
    logger.info("="*60)
    
    all_links = get_category_links()
    total_found = len(all_links)
    
    if isinstance(max_cats, int) and max_cats > 0:
        all_links = all_links[:max_cats]
        logger.info(f" Found {total_found} categories. Limited to {len(all_links)} for this run.")
    else:
        logger.info(f" Found {total_found} categories. Processing all.")

    #?? filtre for top categories only
    all_links = [link for link in all_links if any(x in link.lower() for x in top_categories)]
    
    started = time.time()
    total_cats = len(all_links)
    all_products = []
    
    for i, cat in enumerate(all_links, start=1):
        elapsed = time.time() - started
        logger.info("")
        logger.info(f"{'='*60}")
        logger.info(f"Category {i}/{total_cats} | ETA {fmt_eta(elapsed, i, total_cats)}")
        logger.info(f"URL: {cat}")
        logger.info(f"{'='*60}")
        
        try:
            df_c = scrape_category_page(cat, max_pages)
            df_c["category"] = cat
            all_products.append(df_c)
            logger.info(f"Category {i}/{total_cats} complete: {len(df_c)} products")
        except Exception as e:
            logger.error(f"Failed to scrape category {i}/{total_cats}: {cat}", exc_info=True)
            continue
    
    if not all_products:
        logger.warning("No products scraped from any category!")
        return pd.DataFrame()
    
    final_df = pd.concat(all_products, ignore_index=True)
    logger.info("")
    logger.info("="*60)
    logger.info(f"SCRAPING COMPLETE!")
    logger.info(f"Total products scraped: {len(final_df)}")
    logger.info(f"Total time: {time.time() - started:.1f}s")
    logger.info("="*60)
    
    return final_df


# CLI entry point
def main():
    """Command-line interface for the scraper"""
    # Set up basic logging for CLI usage
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    parser = argparse.ArgumentParser(description="Mytek scraper runner")
    parser.add_argument("--mode", choices=["categories", "category"], default="categories",
                        help="Run all discovered categories or a single category URL")
    parser.add_argument("--category_url", help="Specific Mytek category URL when --mode=category")
    parser.add_argument("--max_pages", type=int, default=3, help="Max pages per category to scrape")
    parser.add_argument("--dry", action="store_true", help="Do not write to DB; just print a preview")
    parser.add_argument("--to_json", help="Optional path to save results as JSON")
    parser.add_argument("--max_cats", type=int, default=None, help="Limit number of categories to process (for testing)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose (DEBUG) logging")
    args = parser.parse_args()
    
    # Adjust log level if verbose
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
        logger.setLevel(logging.DEBUG)

    logger.info("Starting Mytek scraper CLI")
    logger.info(f"Mode: {args.mode}")
    
    if args.mode == "category":
        if not args.category_url:
            logger.error("--category_url is required when --mode=category")
            raise SystemExit("--category_url is required when --mode=category")
        df_c = scrape_category_page(args.category_url, max_pages=args.max_pages)
        df_c["category"] = args.category_url
    else:
        df_c = scrape_mytek_all_categories(max_pages=args.max_pages, max_cats=args.max_cats)

    # Output / persistence
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
CREATE DATABASE IF NOT EXISTS airflow;

-- Schemas
CREATE SCHEMA IF NOT EXISTS raw;

-- RAW: append-only listing rows from scrapers (you already write df_c here)
CREATE TABLE IF NOT EXISTS raw.scraped_products (
  id            BIGSERIAL PRIMARY KEY,
  vendor        TEXT NOT NULL,
  product_name  TEXT,
  price_raw     TEXT,
  price_value   NUMERIC(18,2),
  currency      TEXT DEFAULT 'TND',
  url           TEXT,
  category      TEXT,
  scraped_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_raw_scraped_products_vendor ON raw.scraped_products(vendor);
CREATE INDEX IF NOT EXISTS ix_raw_scraped_products_time   ON raw.scraped_products(scraped_at);
CREATE INDEX IF NOT EXISTS ix_raw_scraped_products_url    ON raw.scraped_products(url);

-- (optional) error log
CREATE TABLE IF NOT EXISTS raw.scrape_errors (
  id          BIGSERIAL PRIMARY KEY,
  vendor      TEXT NOT NULL,
  context     TEXT,
  error_msg   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
-- Schemas
CREATE SCHEMA IF NOT EXISTS raw;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS marts;

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

-- CORE: one offer per vendor URL
CREATE TABLE IF NOT EXISTS core.offers (
  offer_id            BIGSERIAL PRIMARY KEY,
  vendor              TEXT NOT NULL,
  url                 TEXT NOT NULL UNIQUE,
  product_name_clean  TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- CORE: append-only price history (only insert when price changes)
CREATE TABLE IF NOT EXISTS core.prices (
  price_id     BIGSERIAL PRIMARY KEY,
  offer_id     BIGINT NOT NULL REFERENCES core.offers(offer_id) ON DELETE CASCADE,
  price_value  NUMERIC(18,2) NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'TND',
  observed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_core_prices_offer_time ON core.prices(offer_id, observed_at DESC);
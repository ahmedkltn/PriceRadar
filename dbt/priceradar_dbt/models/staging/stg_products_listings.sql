{{ config(materialized='view', schema='staging') }}

WITH base AS (
  SELECT
    LOWER(TRIM(product_name)) AS product_name_clean,
    price_value,
    COALESCE(currency,'TND') AS currency,
    vendor,
    url,
    category,
    scraped_at
  FROM {{ source('raw','scraped_products') }}
  WHERE price_value IS NOT NULL AND NOT price_value::TEXT ILIKE '%nan%'
),
hourly_dedup AS (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY url, DATE_TRUNC('hour', scraped_at)
           ORDER BY scraped_at DESC
         ) AS rn
  FROM base
)
SELECT *
FROM hourly_dedup
WHERE rn = 1
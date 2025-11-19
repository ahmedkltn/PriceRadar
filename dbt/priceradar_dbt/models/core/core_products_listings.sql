{{ config(materialized='view', schema='core') }}

SELECT
  product_name_clean,
  price_value,
  currency,
  vendor,
  url,
  image_url,
  full_category_url,
  category,
  subcategory,
  brand_name,
  brand_image_url,
  scraped_at
FROM {{ ref('stg_mytek_listings') }}

UNION ALL

SELECT
  product_name_clean,
  price_value,
  currency,
  vendor,
  url,
  image_url,
  full_category_url,
  category,
  subcategory,
  brand_name,
  brand_image_url,
  scraped_at
FROM {{ ref('stg_tunisianet_listings') }}
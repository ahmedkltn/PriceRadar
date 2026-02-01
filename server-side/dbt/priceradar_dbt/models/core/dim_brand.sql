{{ config(materialized='table', schema='core') }}

WITH base AS (
  SELECT DISTINCT
    brand_name,
    brand_image_url,
    vendor
  FROM {{ ref('core_products_listings') }}
  WHERE brand_name IS NOT NULL
)

SELECT
  {{ dbt_utils.generate_surrogate_key(['brand_name', 'vendor']) }} AS vendor_brand_id,
  brand_name AS vendor_brand_name,
  brand_image_url AS vendor_brand_image_url,
  vendor
FROM base

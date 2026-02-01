{{ config(materialized='table',unique_key='vendor_category_id', schema='core') }}

WITH base AS (
  SELECT DISTINCT
    vendor,
    category
  FROM {{ ref('core_products_listings') }}
  WHERE category IS NOT NULL
)

SELECT
  {{ dbt_utils.generate_surrogate_key(['vendor', 'category']) }} AS vendor_category_id,
  vendor,
  category AS vendor_category_name
FROM base

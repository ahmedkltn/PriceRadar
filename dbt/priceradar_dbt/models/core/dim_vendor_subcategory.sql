{{ config(materialized='table', unique_key='vendor_subcategory_id',schema='core') }}

WITH base AS (
  SELECT DISTINCT
    vendor,
    category,
    subcategory
  FROM {{ ref('stg_products_listings') }}
  WHERE subcategory IS NOT NULL
),

with_cat AS (
  SELECT
    {{ dbt_utils.generate_surrogate_key(['vendor', 'category']) }} AS vendor_category_id,
    vendor,
    category,
    subcategory
  FROM base
)

SELECT
  {{ dbt_utils.generate_surrogate_key(
      ['vendor_category_id', 'subcategory']
  ) }} AS vendor_subcategory_id,
  vendor_category_id,
  vendor,
  category AS vendor_category_name,
  subcategory AS vendor_subcategory_name
FROM with_cat

{{ config(
    materialized = 'table',
    schema       = 'core'
) }}

WITH offers AS (
  SELECT
    o.offer_id,
    o.vendor,
    o.url,
    o.product_name_clean,
    o.image_url,
    o.vendor_subcategory_id,
    o.vendor_category_id,
    o.vendor_brand_id
  FROM {{ ref('core_offers') }} o
),

brands AS (
  SELECT
    vendor_brand_id,
    vendor,
    vendor_brand_name
  FROM {{ ref('dim_brand') }}
),

cats AS (
  SELECT
    vendor_category_id,
    vendor,
    vendor_category_name
  FROM {{ ref('dim_vendor_category') }}
),

subcats AS (
  SELECT
    vendor_subcategory_id,
    vendor,
    vendor_subcategory_name
  FROM {{ ref('dim_vendor_subcategory') }}
)

SELECT
  o.offer_id,
  o.vendor,
  o.url,
  o.product_name_clean,
  o.image_url,

  -- brand
  b.vendor_brand_name AS brand_name,

  -- category / subcategory labels
  c.vendor_category_name    AS category_name,
  s.vendor_subcategory_name AS subcategory_name

FROM offers o
LEFT JOIN brands  b
  ON o.vendor_brand_id = b.vendor_brand_id
LEFT JOIN cats    c
  ON o.vendor_category_id = c.vendor_category_id
LEFT JOIN subcats s
  ON o.vendor_subcategory_id = s.vendor_subcategory_id
{{ config(
    materialized='incremental',
    unique_key='offer_id',         
    schema='core'
) }}

WITH src AS (
  SELECT
    {{ dbt_utils.generate_surrogate_key(['vendor', 'url']) }} AS offer_id,
    vendor,
    url,
    product_name_clean,
    category,
    subcategory,
    image_url
  FROM {{ ref('stg_products_listings') }}
),

joined AS (
  SELECT
    s.offer_id,
    s.vendor,
    s.url,
    s.product_name_clean,
    s.image_url,
    dsub.vendor_subcategory_id,
    dsub.vendor_category_id
  FROM src s
  LEFT JOIN {{ ref('dim_vendor_subcategory') }} dsub
    ON s.vendor      = dsub.vendor
   AND s.category    = dsub.vendor_category_name
   AND s.subcategory = dsub.vendor_subcategory_name
)

SELECT DISTINCT
  offer_id,
  vendor,
  url,
  image_url,
  product_name_clean,
  vendor_subcategory_id
FROM joined

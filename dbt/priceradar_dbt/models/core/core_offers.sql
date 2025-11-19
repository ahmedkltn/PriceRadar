{{ config(
    materialized = 'incremental',
    unique_key   = 'offer_id',
    schema       = 'core'
) }}

WITH src AS (
  SELECT
    {{ dbt_utils.generate_surrogate_key(['vendor', 'url']) }} AS offer_id,
    vendor,
    url,
    product_name_clean,
    category,
    subcategory,
    image_url,
    brand_name
  FROM {{ ref('core_products_listings') }}
),

joined AS (
  SELECT
    s.offer_id,
    s.vendor,
    s.url,
    s.product_name_clean,
    s.image_url,
    s.brand_name,
    dsub.vendor_subcategory_id,
    dsub.vendor_category_id
  FROM src s
  LEFT JOIN {{ ref('dim_vendor_subcategory') }} dsub
    ON s.vendor      = dsub.vendor
   AND s.category    = dsub.vendor_category_name
   AND s.subcategory = dsub.vendor_subcategory_name
),

final AS (
  SELECT
    j.offer_id,
    j.vendor,
    j.url,
    j.image_url,
    j.product_name_clean,
    j.brand_name,
    j.vendor_subcategory_id,
    j.vendor_category_id,
    b.vendor_brand_id
  FROM joined j
  LEFT JOIN {{ ref('dim_brand') }} b
    ON j.vendor      = b.vendor
   AND j.brand_name  = b.vendor_brand_name
)

SELECT DISTINCT
  offer_id,
  vendor,
  url,
  image_url,
  product_name_clean,
  vendor_subcategory_id,
  vendor_category_id,
  vendor_brand_id
FROM final
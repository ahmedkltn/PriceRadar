{{ config(materialized='incremental', unique_key='url', schema='core') }}

SELECT DISTINCT
  {{ dbt_utils.generate_surrogate_key(['vendor', 'url']) }} AS offer_id,
  vendor,
  url,
  product_name_clean
FROM {{ ref('stg_products_listings') }}
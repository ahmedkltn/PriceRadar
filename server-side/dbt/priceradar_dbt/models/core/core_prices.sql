{{ config(materialized='incremental', unique_key='__synthetic__', schema='core') }}

WITH src AS (
  SELECT s.url, s.price_value, s.currency, s.scraped_at
  FROM {{ ref('core_products_listings') }} s
),
offers AS (
  SELECT offer_id, url FROM {{ ref('core_offers') }}
),
joined AS (
  SELECT o.offer_id,
         s.price_value,
         s.currency,
         COALESCE(s.scraped_at, NOW()) AS observed_at
  FROM src s
  JOIN offers o USING (url)
),

{% if is_incremental() %}
last_price AS (
  SELECT offer_id, price_value AS last_price
  FROM (
    SELECT offer_id, price_value,
           ROW_NUMBER() OVER (PARTITION BY offer_id ORDER BY observed_at DESC) rn
    FROM {{ this }}
  ) t
  WHERE rn = 1
),
{% else %}
last_price AS (
  SELECT NULL::text AS offer_id, NULL::numeric AS last_price
  WHERE FALSE
),
{% endif %}

to_insert AS (
  SELECT j.offer_id, j.price_value, j.currency, j.observed_at
  FROM joined j
  LEFT JOIN last_price lp USING (offer_id)
  WHERE lp.last_price IS DISTINCT FROM j.price_value
)

SELECT
  CONCAT(offer_id, '-', REPLACE(observed_at::text,' ','_'), '-', price_value) AS __synthetic__,
  offer_id, price_value, currency, observed_at
FROM to_insert
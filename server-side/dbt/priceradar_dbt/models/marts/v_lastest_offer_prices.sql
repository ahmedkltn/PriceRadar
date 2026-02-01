{{ config(materialized='view', schema='marts') }}

WITH latest AS (
  SELECT
    offer_id, price_value, currency, observed_at,
    ROW_NUMBER() OVER (PARTITION BY offer_id ORDER BY observed_at DESC) rn
  FROM {{ ref('core_prices') }}
)
SELECT offer_id, price_value, currency, observed_at
FROM latest
WHERE rn = 1
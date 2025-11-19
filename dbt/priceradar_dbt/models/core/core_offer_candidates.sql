{{ config(
    materialized = 'table',
    schema       = 'core'
) }}

-- 1) Base offers from enriched table
WITH base AS (
  SELECT
    offer_id,
    vendor,
    brand_name,
    product_name_clean
  FROM {{ ref('core_offers_enriched') }}
  WHERE brand_name IS NOT NULL
),

-- 2) Tokenize product names
tokenized AS (
  SELECT
    offer_id,
    vendor,
    LOWER(brand_name) AS brand_key,
    product_name_clean,
    regexp_split_to_array(
      LOWER(
        regexp_replace(product_name_clean, '[^a-z0-9]+', ' ', 'g')
      ),
      '\s+'
    ) AS tokens
  FROM base
),



normalized AS (
  SELECT
    offer_id,
    vendor,
    brand_key,
    product_name_clean,
    ARRAY(
      SELECT DISTINCT t
      FROM unnest(tokens) AS t
      WHERE t NOT IN (
          'pc','portable','ordinateur','gamer','laptop',
          'lenovo','asus','dell','hp','apple','msi','acer',
          'vivobook','ideapad','thinkbook','notebook',
          'telephone','téléphone','smartphone','mobile','tv'
        )
    ) AS tokens
  FROM tokenized
),

-- 4) All cross-vendor pairs with same brand
pairs AS (
  SELECT
    a.offer_id AS offer_id_a,
    b.offer_id AS offer_id_b,
    a.vendor   AS vendor_a,
    b.vendor   AS vendor_b,
    a.brand_key AS brand_key,
    a.product_name_clean AS name_a,
    b.product_name_clean AS name_b,
    a.tokens AS tokens_a,
    b.tokens AS tokens_b
  FROM normalized a
  JOIN normalized b
    ON a.brand_key = b.brand_key
   AND a.offer_id  < b.offer_id      -- avoid duplicates/self-pairs
   AND a.vendor    <> b.vendor       -- only cross-vendor
),

-- 5) Compute overlap count between token arrays
scored AS (
  SELECT
    offer_id_a,
    offer_id_b,
    vendor_a,
    vendor_b,
    brand_key,
    name_a,
    name_b,
    (
      SELECT COUNT(*)::int
      FROM (
        SELECT unnest(tokens_a)
        INTERSECT
        SELECT unnest(tokens_b)
      ) s
    ) AS overlap_count
  FROM pairs
)

-- 6) Keep only pairs with enough overlapping tokens
SELECT
  offer_id_a,
  offer_id_b,
  vendor_a,
  vendor_b,
  brand_key,
  name_a,
  name_b,
  overlap_count
FROM scored
WHERE overlap_count >= 3 
ORDER BY brand_key, overlap_count DESC
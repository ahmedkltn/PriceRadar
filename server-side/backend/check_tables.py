#!/usr/bin/env python
"""Quick script to check which pricing tables exist"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'priceradar_backend.settings')
django.setup()

from pricing.admin_utils import table_exists, get_table_schema

tables_to_check = [
    'core_offers',
    'core_prices',
    'dim_product',
    'dim_vendor_category',
    'dim_vendor_subcategory',
    'dim_brand',
    'offer_product_map',
    'v_lastest_offer_prices',
]

print("=" * 60)
print("Database Table Status Check")
print("=" * 60)
print()

for table in tables_to_check:
    exists = table_exists(table)
    schema = get_table_schema(table) if exists else None
    status = "✓ EXISTS" if exists else "✗ NOT FOUND"
    schema_info = f" (schema: {schema})" if schema else ""
    print(f"{status:12} {table:30} {schema_info}")

print()
print("=" * 60)
print("Note: Tables are created by dbt/Airflow data pipeline")
print("=" * 60)

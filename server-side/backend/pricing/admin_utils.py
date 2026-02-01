"""Utility functions for admin to check if tables exist"""
from django.db import connection
from django.core.exceptions import ImproperlyConfigured


def table_exists(table_name, schema=None):
    """Check if a table exists in the database across all schemas in search_path"""
    with connection.cursor() as cursor:
        if schema:
            # Check specific schema
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = %s 
                    AND table_name = %s
                )
            """, [schema, table_name])
            return cursor.fetchone()[0]
        else:
            # Check all schemas in search_path (public, public_core, public_marts, public_staging, raw)
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema IN ('public', 'public_core', 'public_marts', 'public_staging', 'raw')
                    AND table_name = %s
                )
            """, [table_name])
            return cursor.fetchone()[0]


def get_table_schema(table_name):
    """Get the schema where a table might exist"""
    # Check common schemas
    schemas = ['public', 'public_core', 'public_marts', 'public_staging', 'raw']
    for schema in schemas:
        if table_exists(table_name, schema):
            return schema
    return None

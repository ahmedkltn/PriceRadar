import psycopg

# Try with psycopg (v3) which handles encoding better
try:
    conn = psycopg.connect(
        dbname='priceradar',
        user='priceradar',
        password='priceradar123',
        host='localhost',
        port=5432
    )
    print('Connection successful with psycopg!')
    conn.close()
except Exception as e:
    print(f'Connection failed: {e}')
    import traceback
    traceback.print_exc()

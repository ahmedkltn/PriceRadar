#!/bin/bash
docker exec priceradar-db psql -U postgres -c "ALTER USER priceradar WITH PASSWORD 'priceradar123';"

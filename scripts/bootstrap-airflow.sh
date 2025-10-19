#!/usr/bin/env bash
set -euo pipefail

# Wait for TCP socket first (no auth)
until pg_isready -h "${PG_HOST:-postgres}" -p "${PG_PORT:-5432}" >/dev/null 2>&1; do
  echo "Waiting for Postgres socket..."
  sleep 2
done

# Then wait for authenticated SQL (ensures roles/password OK)
until PGPASSWORD="${PG_PASSWORD:-admin}" psql \
    -h "${PG_HOST:-postgres}" -p "${PG_PORT:-5432}" \
    -U "${PG_USER:-admin}" -d postgres -c "select 1" >/dev/null 2>&1; do
  echo "Waiting for Postgres auth..."
  sleep 2
done

echo "Ensuring '${PG_AIRFLOW_DB}' database exists (via compose sql init on fresh volumes)..."
# On brand-new volumes, sql/00*.sql already created it. On existing volumes it's fine.

export AIRFLOW__DATABASE__SQL_ALCHEMY_CONN="postgresql+psycopg2://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_AIRFLOW_DB}"

echo "Running Airflow DB migrations (idempotent)..."
airflow db migrate

echo "Ensuring default admin exists..."
if ! airflow users list | awk '{print $1}' | grep -qx "${AIRFLOW_ADMIN_USERNAME}"; then
  airflow users create \
    --username "${AIRFLOW_ADMIN_USERNAME}" \
    --password "${AIRFLOW_ADMIN_PASSWORD}" \
    --firstname "${AIRFLOW_ADMIN_FIRST}" \
    --lastname "${AIRFLOW_ADMIN_LAST}" \
    --role Admin \
    --email "${AIRFLOW_ADMIN_EMAIL}"
else
  echo "Admin user '${AIRFLOW_ADMIN_USERNAME}' already exists."
fi

echo "Bootstrap done."
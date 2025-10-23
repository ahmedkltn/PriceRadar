FROM apache/airflow:3.1.0


ARG AIRFLOW_VERSION=3.1.0
ARG PYTHON_VERSION=3.12
ARG CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt"


# 1) System deps (root)
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libxml2-dev libxslt1-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /opt/airflow/logs && chown -R airflow: /opt/airflow/logs

# 2) Python deps + Playwright as airflow
USER airflow
COPY airflow_dags/requirements.txt /requirements.txt
RUN python -m pip install --no-cache-dir -r /requirements.txt
RUN python -m playwright install chromium
USER root
RUN playwright install-deps
USER airflow
RUN python -m pip install --no-cache-dir apache-airflow-providers-fab

# 3) Env
ENV DBT_PROFILES_DIR=/opt/airflow/dbt/.dbt \
    PYTHONUNBUFFERED=1
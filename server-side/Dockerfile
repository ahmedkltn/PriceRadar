FROM apache/airflow:3.1.0

ARG AIRFLOW_VERSION=3.1.0
ARG PYTHON_VERSION=3.12

# ================================================================
# System Dependencies (as root)
# ================================================================
USER root

# Install system packages in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libxml2-dev \
    libxslt1-dev \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create and set permissions for Airflow directories
RUN mkdir -p /opt/airflow/logs /opt/airflow/dbt/.dbt \
    && chown -R airflow:root /opt/airflow

USER airflow

# Add local bin to PATH
ENV PATH="/home/airflow/.local/bin:${PATH}"

# Copy requirements and install Python packages
COPY requirements.txt /requirements.txt

RUN python -m pip install --upgrade pip && \
    python -m pip install --no-cache-dir -r /requirements.txt

USER root

# Install Playwright (Python package) and system dependencies as root
RUN pip install playwright && \
    playwright install-deps chromium

# Install Chromium browser for Playwright as airflow user so cache is under /home/airflow
USER airflow
RUN playwright install chromium

# Environment variables
ENV DBT_PROFILES_DIR=/opt/airflow/dbt/.dbt \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
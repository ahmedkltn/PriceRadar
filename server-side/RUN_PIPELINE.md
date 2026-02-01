# Running the PriceRadar Pipeline

This guide shows you how to run the data pipeline to scrape data and create database tables.

## Prerequisites

1. **All services must be running:**
   ```bash
   cd server-side
   docker-compose ps
   ```

2. **Required services:**
   - PostgreSQL (priceradar-db)
   - Airflow API Server (airflow-apiserver) - Port 8080
   - Airflow Scheduler (airflow-scheduler)
   - Django (priceradar-django) - Port 8000

## Method 1: Using Airflow Web UI (Recommended)

### Step 1: Start Airflow Services

```bash
cd server-side
docker-compose up -d airflow-init airflow-apiserver airflow-scheduler airflow-dag-processor
```

Wait for services to be ready (about 30-60 seconds):
```bash
# Check if Airflow is ready
curl http://localhost:8080/health
```

### Step 2: Access Airflow UI

1. Open your browser and go to: **http://localhost:8080**
2. Login with credentials:
   - **Username:** `airflow`
   - **Password:** `airflow`

### Step 3: Trigger the Pipeline

1. In the Airflow UI, find the DAG named **`priceradar_pipeline`**
2. Toggle the DAG to **ON** (if it's paused)
3. Click the **Play button** (▶️) next to the DAG name
4. Select **"Trigger DAG"** from the dropdown

### Step 4: Monitor Progress

1. Click on the DAG name to see the graph view
2. Watch the tasks execute:
   - 🟡 Yellow = Running
   - 🟢 Green = Success
   - 🔴 Red = Failed
3. Click on any task to view logs

## Method 2: Using Airflow CLI

### Step 1: Access Airflow CLI Container

```bash
cd server-side
docker exec -it airflow-cli bash
```

### Step 2: Trigger the Pipeline

```bash
# List available DAGs
airflow dags list

# Trigger the pipeline
airflow dags trigger priceradar_pipeline

# Check DAG status
airflow dags state priceradar_pipeline $(date +%Y-%m-%d)
```

### Step 3: Monitor via CLI

```bash
# List recent DAG runs
airflow dags list-runs -d priceradar_pipeline

# View task logs
airflow tasks logs priceradar_pipeline scrape_mytek $(date +%Y-%m-%d)
```

## Method 3: Direct Docker Command

```bash
cd server-side

# Trigger the pipeline directly
docker exec -it airflow-scheduler airflow dags trigger priceradar_pipeline

# Or use the CLI container
docker exec -it airflow-cli airflow dags trigger priceradar_pipeline
```

## Pipeline Tasks

The pipeline executes these tasks in order:

1. **scrape_mytek** - Scrapes products from Mytek.tn
2. **scrape_tunisianet** - Scrapes products from TunisiaNet.tn
3. **dbt_build_core** - Transforms raw data into core models (creates tables)
4. **dbt_build_marts** - Creates analytics views
5. **product_matcher** - Matches products across vendors

## Expected Duration

- **Scraping tasks:** 5-15 minutes each (depends on website speed)
- **dbt transformations:** 1-3 minutes
- **Total:** ~15-30 minutes

## Verify Tables Were Created

After the pipeline completes, verify tables exist:

```bash
# Using the check script
docker exec priceradar-django python check_tables.py

# Or manually check in Django admin
# Go to: http://localhost:8000/admin/pricing/
```

## Troubleshooting

### Airflow Not Accessible

```bash
# Check if services are running
docker-compose ps

# Check logs
docker-compose logs airflow-apiserver
docker-compose logs airflow-scheduler

# Restart services
docker-compose restart airflow-apiserver airflow-scheduler
```

### DAG Not Appearing

```bash
# Check DAG parsing
docker exec -it airflow-scheduler airflow dags list

# Check for errors
docker-compose logs airflow-dag-processor | grep -i error
```

### Scraping Fails

```bash
# Check scraper logs
docker exec -it airflow-scheduler bash
cd /opt/airflow
# View logs in Airflow UI or check:
ls -la /opt/airflow/logs/
```

### dbt Fails

```bash
# Check dbt connection
docker exec -it airflow-scheduler bash
cd /opt/airflow/dbt/priceradar_dbt
dbt debug

# Test dbt run manually
dbt run --select stg_mytek_listings
```

## Quick Start Script

Create a file `run_pipeline.sh`:

```bash
#!/bin/bash
cd server-side

echo "Starting Airflow services..."
docker-compose up -d airflow-init airflow-apiserver airflow-scheduler airflow-dag-processor

echo "Waiting for Airflow to be ready..."
sleep 30

echo "Triggering pipeline..."
docker exec -it airflow-scheduler airflow dags trigger priceradar_pipeline

echo "Pipeline triggered! Monitor at: http://localhost:8080"
echo "Check tables with: docker exec priceradar-django python check_tables.py"
```

Make it executable and run:
```bash
chmod +x run_pipeline.sh
./run_pipeline.sh
```

## Next Steps

Once the pipeline completes:

1. **Check Admin Dashboard:**
   - http://localhost:8000/api/admin/dashboard/
   - Should show non-zero counts for products, offers, prices

2. **Browse Data in Admin:**
   - http://localhost:8000/admin/pricing/
   - All tables should now be visible with data

3. **Test API Endpoints:**
   - http://localhost:8000/api/v1/products
   - http://localhost:8000/api/v1/offers
   - http://localhost:8000/api/v1/vendors

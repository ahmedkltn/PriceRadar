# Quick Start: Run PriceRadar Pipeline

Follow these commands in order to scrape data and create tables.

## Step 1: Start Airflow Services

```bash
cd server-side
docker-compose up -d airflow-init airflow-apiserver airflow-scheduler airflow-dag-processor
```

## Step 2: Wait for Airflow to Initialize (30-60 seconds)

```bash
# Check if Airflow is ready
curl http://localhost:8080/health

# Or check service status
docker-compose ps | grep airflow
```

## Step 3: Trigger the Pipeline

**Option A: Using Airflow CLI (Recommended)**
```bash
docker exec -it airflow-scheduler airflow dags trigger priceradar_pipeline
```

**Option B: Using Airflow Web UI**
1. Open browser: http://localhost:8080
2. Login: username=`airflow`, password=`airflow`
3. Find `priceradar_pipeline` DAG
4. Click Play button (▶️) → "Trigger DAG"

## Step 4: Monitor Progress

**Check DAG status:**
```bash
docker exec -it airflow-scheduler airflow dags state priceradar_pipeline $(date +%Y-%m-%d)
```

**View logs:**
```bash
# View scheduler logs
docker-compose logs -f airflow-scheduler

# Or check in Airflow UI: http://localhost:8080
```

## Step 5: Verify Tables Were Created

```bash
# Check which tables exist
docker exec priceradar-django python check_tables.py

# Check admin dashboard
curl http://localhost:8000/api/admin/dashboard/
```

## Step 6: Access Data

- **Admin Panel:** http://localhost:8000/admin/pricing/
- **API Products:** http://localhost:8000/api/v1/products
- **API Offers:** http://localhost:8000/api/v1/offers

---

## Troubleshooting Commands

**If Airflow services fail to start:**
```bash
# Check logs
docker-compose logs airflow-init
docker-compose logs airflow-scheduler

# Restart services
docker-compose restart airflow-apiserver airflow-scheduler
```

**If pipeline fails:**
```bash
# Check specific task logs
docker exec -it airflow-scheduler airflow tasks logs priceradar_pipeline scrape_mytek $(date +%Y-%m-%d)

# Re-trigger pipeline
docker exec -it airflow-scheduler airflow dags trigger priceradar_pipeline
```

**Check database directly:**
```bash
docker exec -it priceradar-db psql -U priceradar -d priceradar -c "\dt raw.*"
docker exec -it priceradar-db psql -U priceradar -d priceradar -c "SELECT COUNT(*) FROM raw.scraped_products;"
```

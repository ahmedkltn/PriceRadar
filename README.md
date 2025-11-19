# 🛰️ PriceRadar

> Track and compare product prices from multiple competitors, powered by Python, Airflow, dbt, Django, and Next.js.

---

## 📖 Overview

**PriceRadar** is a full-stack price comparison and competitive intelligence platform that automatically scrapes, processes, and visualizes product pricing data from multiple Tunisian e-commerce websites. Built with modern data engineering and web development tools, it provides real-time insights into market pricing trends.

### Key Features

- **Automated Data Collection**: Scrapes products from multiple e-commerce sites (Mytek, TunisiaNet) using Playwright and BeautifulSoup
- **Robust Data Pipeline**: Orchestrates daily scraping workflows with Apache Airflow
- **Data Modeling**: Transforms raw scraped data into clean, analytics-ready models using dbt
- **RESTful API**: Exposes pricing data through a Django REST backend
- **Modern Frontend**: Displays comparative pricing and trends in a Next.js web application
- **Containerized Architecture**: Fully dockerized setup for easy deployment and scalability

### Use Cases

- Competitive pricing analysis for e-commerce businesses
- Price monitoring for consumers looking for the best deals
- Market research and trend analysis
- Internal dashboards for business intelligence

---

## 🏗️ Architecture

PriceRadar follows a modern data platform architecture:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  E-commerce │────▶│    Airflow   │────▶│   dbt Core  │────▶│   Django     │
│   Websites  │     │   Scrapers   │     │  Transform  │     │     API      │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                            │                     │                    │
                            ▼                     ▼                    ▼
                    ┌──────────────────────────────────────────────────────┐
                    │           PostgreSQL Database                         │
                    │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
                    │  │   raw    │─▶│  staging │─▶│  core + marts    │   │
                    │  └──────────┘  └──────────┘  └──────────────────┘   │
                    └──────────────────────────────────────────────────────┘
                                             │
                                             ▼
                                    ┌──────────────┐
                                    │   Next.js    │
                                    │   Frontend   │
                                    └──────────────┘
```

### Tech Stack

**Data Collection & Processing**
- **Python 3.x**: Core programming language
- **Playwright**: Browser automation for dynamic content scraping
- **BeautifulSoup4**: HTML parsing and data extraction
- **Pandas**: Data manipulation and transformation

**Orchestration & Transformation**
- **Apache Airflow 3.1**: Workflow orchestration and scheduling
- **dbt (Data Build Tool)**: SQL-based data transformation and modeling

**Storage**
- **PostgreSQL 15**: Primary data warehouse with multi-schema design (raw, staging, core, marts)

**Backend**
- **Django**: Web framework and REST API
- **psycopg2**: PostgreSQL database adapter

**Frontend**
- **Next.js**: React-based web application framework
- **React**: UI component library

**Infrastructure**
- **Docker & Docker Compose**: Containerization and orchestration
- **Makefile**: Development workflow automation

---

## 📁 Project Structure

```
PriceRadar/
├── airflow_dags/              # Airflow configuration
│   ├── dags/                  # DAG definitions
│   │   └── priceradar_pipeline.py  # Main ETL pipeline
│   ├── config/                # Airflow configuration files
│   ├── plugins/               # Custom Airflow plugins
│   └── airflow_logs/          # Airflow execution logs
├── backend/                   # Django REST API
│   ├── priceradar_backend/    # Main Django project
│   ├── pricing/               # Pricing app
│   └── manage.py              # Django management script
├── frontend/                  # Next.js web application
├── dbt/                       # dbt project
│   ├── priceradar_dbt/        # dbt models and transformations
│   │   ├── models/            # SQL transformation models
│   │   │   ├── staging/       # Staging models
│   │   │   ├── core/          # Core business logic models
│   │   │   └── marts/         # Analytics-ready views
│   │   └── dbt_project.yml    # dbt configuration
│   └── .dbt/                  # dbt profiles
├── scripts/                   # Utility scripts
│   ├── scraper/               # Web scraping modules
│   │   ├── mytek_scraper.py
│   │   └── tunisianet_scraper.py
│   ├── utils_pkg/             # Helper utilities
│   └── bootstrap-airflow.sh   # Airflow initialization script
├── sql/                       # Database schemas
│   └── schema.sql             # Initial database setup
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Airflow custom image
├── Makefile                   # Development commands
└── requirements.txt           # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Make (optional, for convenience commands)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PriceRadar.git
   cd PriceRadar
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # Database Configuration
   PG_USER=priceradar
   PG_PASSWORD=your_secure_password
   PG_HOST=postgres
   PG_PORT=5432
   PG_APPDB=priceradar
   PG_AIRFLOW_DB=airflow

   # Airflow Configuration
   AIRFLOW_UID=50000
   _AIRFLOW_WWW_USER_USERNAME=airflow
   _AIRFLOW_WWW_USER_PASSWORD=airflow

   # dbt Configuration
   DBT_PROFILES_DIR=/opt/airflow/dbt/.dbt
   ```

3. **Build and start services**
   ```bash
   # Using Make
   make up

   # Or using Docker Compose directly
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database (port 5432)
   - Airflow webserver (port 8080)
   - Airflow scheduler
   - Airflow API server
   - DAG processor
   - Triggerer

4. **Access the services**
   - **Airflow UI**: http://localhost:8080
     - Username: `airflow`
     - Password: `airflow`
   - **PostgreSQL**: localhost:5432

### First Run

The initialization script (`bootstrap-airflow.sh`) automatically:
- Creates the Airflow database and runs migrations
- Sets up the admin user
- Installs Playwright browsers for scraping
- Initializes dbt profiles

---

## 🔧 Usage

### Running the Data Pipeline

The main ETL pipeline (`priceradar_pipeline`) runs daily at midnight (configurable in the DAG).

**Manual trigger via Airflow UI:**
1. Navigate to http://localhost:8080
2. Find the `priceradar_pipeline` DAG
3. Click the play button to trigger a manual run

**Manual trigger via CLI:**
```bash
# Access the Airflow CLI
docker exec -it <airflow-scheduler-container> bash

# Trigger the DAG
airflow dags trigger priceradar_pipeline
```

### Pipeline Steps

The pipeline executes the following tasks:

1. **scrape_mytek**: Scrapes product listings from Mytek.tn
2. **scrape_tunisianet**: Scrapes product listings from TunisiaNet.tn
3. **dbt_build_core**: Transforms raw data through staging and core models
4. **dbt_build_marts**: Creates analytics-ready views

### Development Commands

Using the Makefile:

```bash
# Start all services
make up

# Stop all services
make down

# View logs
make logs

# Check service status
make ps

# Full reset (removes volumes and rebuilds)
make reset

# Rebuild Airflow image
make rebuild

# Re-run initialization
make init
```

### Database Schema

**Raw Layer** (`raw` schema)
- `scraped_products`: Raw scraped data with vendor, product name, price, URL, etc.
- `scrape_errors`: Error logging for failed scrape attempts

**Staging Layer** (dbt staging models)
- `stg_mytek_listings`: Cleaned Mytek data
- `stg_tunisianet_listings`: Cleaned TunisiaNet data

**Core Layer** (dbt core models)
- `core_offers`: Deduplicated product offers
- `core_prices`: Historical pricing data
- `dim_vendor_category`: Category dimension
- `dim_vendor_subcategory`: Subcategory dimension

**Marts Layer** (dbt marts)
- `v_lastest_offer_prices`: Latest prices view for each product

### Adding New Scrapers

1. Create a new scraper in `scripts/scraper/your_scraper.py`:
   ```python
   def scrape_your_site_all_categories(max_pages=5):
       # Your scraping logic
       return df  # Returns pandas DataFrame
   ```

2. Add the scraper to the DAG in `airflow_dags/dags/priceradar_pipeline.py`:
   ```python
   def run_your_site_scrape():
       df = scrape_your_site_all_categories(max_pages=5)
       save_raw_to_db(df)

   scrape_your_site = PythonOperator(
       task_id="scrape_your_site",
       python_callable=run_your_site_scrape,
   )
   ```

3. Update the task dependencies

---

## 🧪 Data Models (dbt)

### Staging Models

Clean and standardize raw data from different vendors.

- **stg_mytek_listings**: Standardizes Mytek data format
- **stg_tunisianet_listings**: Standardizes TunisiaNet data format

### Core Models

Business logic and historical tracking.

- **core_offers**: Unique product offers across vendors
- **core_prices**: Time-series pricing data
- **dim_vendor_category**: Category lookup table
- **dim_vendor_subcategory**: Subcategory lookup table

### Mart Models

Analytics-ready views optimized for querying.

- **v_lastest_offer_prices**: Current pricing for all products with vendor details

### Running dbt Manually

```bash
# Access the Airflow scheduler container
docker exec -it <airflow-scheduler-container> bash

# Navigate to dbt project
cd /opt/airflow/dbt/priceradar_dbt

# Run all models
dbt run

# Run specific models
dbt run --select stg_mytek_listings

# Test data quality
dbt test

# Generate documentation
dbt docs generate
dbt docs serve
```

---

## 🌐 API & Frontend

### Backend (Django)

The Django backend provides RESTful APIs for querying pricing data.

**Starting the backend (development):**
```bash
cd backend
python manage.py runserver
```

### Frontend (Next.js)

The Next.js frontend displays comparative pricing and trends.

**Starting the frontend (development):**
```bash
cd frontend
npm install
npm run dev
```

Access at http://localhost:3000

---

## 🐛 Troubleshooting

### Airflow Issues

**Webserver not accessible:**
```bash
# Check if all services are running
make ps

# View logs
make logs

# Restart services
make down && make up
```

**DAG not appearing:**
- Check Airflow logs for parsing errors
- Ensure Python syntax is correct in DAG files
- Verify imports are available in the Airflow environment

### Scraping Issues

**Playwright browser installation:**
```bash
docker exec -it <airflow-scheduler-container> bash
playwright install chromium
```

**Database connection errors:**
- Verify PostgreSQL is running: `docker ps`
- Check environment variables in `.env`
- Ensure database exists and schema is initialized

### dbt Issues

**Profile not found:**
- Ensure `DBT_PROFILES_DIR` is set correctly
- Check profiles.yml exists in the dbt/.dbt directory

**Model compilation errors:**
- Run `dbt debug` to check configuration
- Review model SQL for syntax errors

---

## 📊 Monitoring & Logs

### Airflow Logs

- **UI**: http://localhost:8080 → Click on a task → View Logs
- **File system**: `./airflow_dags/airflow_logs/`

### Container Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f airflow-scheduler
docker-compose logs -f postgres
```

### Database Monitoring

```bash
# Connect to PostgreSQL
docker exec -it priceradar-db psql -U priceradar -d priceradar

# Check raw data count
SELECT vendor, COUNT(*) FROM raw.scraped_products GROUP BY vendor;

# Check latest scrape
SELECT vendor, MAX(scraped_at) FROM raw.scraped_products GROUP BY vendor;
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

For active development, you may want to run components outside Docker:

**Python environment:**
```bash
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```


**Happy Price Tracking! 🎯**

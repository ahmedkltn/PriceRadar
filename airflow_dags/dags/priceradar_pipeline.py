from airflow import DAG
from airflow.providers.standard.operators.bash import BashOperator
from airflow.providers.standard.operators.python import PythonOperator
from datetime import datetime, timedelta
import logging
import os, sys


logger = logging.getLogger(__name__)


from scripts.scraper.mytek_scraper import scrape_mytek_all_categories
from scripts.utils_pkg import save_raw_to_db

def run_mytek_scrape():
    logger.info("Starting scrape_mytek task")
    try:



        logger.info("Calling scrape_mytek_all_categories")
        df = scrape_mytek_all_categories(max_pages=2, max_cats=5)
        logger.info(f"Scraping completed, got dataframe: {df.shape}")
        logger.info("Calling save_raw_to_db")
        save_raw_to_db(df)
        logger.info("Data saved to database")
    except Exception as e:
        logger.error(f"Error in scrape_mytek: {str(e)}", exc_info=True)
        raise

default_args = {
    'retries': 0,  
    'retry_delay': timedelta(minutes=5)
}
with DAG(
    dag_id="priceradar_pipeline",
    start_date=datetime(2025, 10, 1),
    schedule="0 0 * * *",
    catchup=False,
    is_paused_upon_creation=False,
    default_args=default_args,
) as dag:
    scrape = PythonOperator(
        task_id="scrape_mytek",
        python_callable=run_mytek_scrape,
    )
    dbt_env = dict(os.environ)
    dbt_env["DBT_PROFILES_DIR"] = dbt_env.get("DBT_PROFILES_DIR", "/opt/airflow/dbt/.dbt")

    dbt_core = BashOperator(
        task_id="dbt_build_core",
        bash_command=(
            "cd /opt/airflow/dbt/priceradar_dbt && "
            "dbt run --select stg_products_listings core_offers core_prices"
        ),
        env=dbt_env,
    )
    dbt_marts = BashOperator(
        task_id="dbt_build_marts",
        bash_command=(
            "cd /opt/airflow/dbt/priceradar_dbt && "
            "dbt run --select v_lates   t_offer_prices"
        ),
        env=dbt_env,
    )
    scrape >> dbt_core >> dbt_marts

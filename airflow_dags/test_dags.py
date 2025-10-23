from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG(
    dag_id='test_dag',
    start_date=datetime(2025, 10, 22),
    schedule="0 0 * * *",
    catchup=False,
    default_args={'retries': 0}
) as dag:
    task = BashOperator(
        task_id='test_task',
        bash_command='echo "Test DAG running"'
    )
SHELL := /bin/bash

up:
	docker-compose up -d

down:
	docker-compose down

reset: ## Full reset (drops volumes), then bootstraps
	docker-compose down -v
	docker-compose build airflow-image
	docker-compose up --no-deps airflow-init
	docker-compose up -d

logs:
	docker-compose logs -f --tail=200

ps:
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

init: ## Re-run just the init (migrate + ensure admin)
	docker-compose up --no-deps airflow-init

rebuild:
	docker-compose build airflow-image
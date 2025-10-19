# -------- settings --------
PROJECT := priceradar
DC := docker-compose
COMPOSE := -f docker-compose.yml
SERVICES := postgres airflow-image airflow-init airflow-webserver airflow-scheduler

export COMPOSE_PROJECT_NAME := $(PROJECT)

# -------- high-level --------
.PHONY: up down restart rebuild init logs ps prune

up: ## Start all services (postgres + airflow)
	$(DC) $(COMPOSE) up -d

down: ## Stop and remove containers (keep volumes)
	$(DC) $(COMPOSE) down

restart: ## Restart all services
	$(DC) $(COMPOSE) restart

rebuild: ## Rebuild airflow images
	$(DC) $(COMPOSE) build airflow-image airflow-init airflow-webserver airflow-scheduler

init: ## One-time init: create airflow DB + migrate + admin user (rerunnable)
	$(DC) $(COMPOSE) up airflow-init

logs: ## Tail airflow logs
	$(DC) $(COMPOSE) logs -f airflow-webserver airflow-scheduler

ps: ## Show container status
	$(DC) $(COMPOSE) ps

prune: ## Remove stopped containers & dangling networks/images
	docker system prune -f
	docker network prune -f

# -------- handy DB/Admin --------
.PHONY: psql airflow-db-check airflow-db-migrate airflow-user
psql: ## Open psql into airflow DB
	$(DC) $(COMPOSE) exec postgres psql -U admin -d airflow

airflow-db-check: ## Check Airflow can reach DB
	$(DC) $(COMPOSE) run --rm airflow-webserver airflow db check

airflow-db-migrate: ## Run Airflow migrations (Airflow 3.x)
	$(DC) $(COMPOSE) run --rm airflow-webserver airflow db migrate

airflow-user: ## (Re)create admin user if missing
	$(DC) $(COMPOSE) run --rm airflow-webserver \
		airflow users create --username admin --password admin \
		--firstname admin --lastname admin --role Admin --email admin@example.com

# -------- dev quality-of-life --------
.PHONY: up-airflow restart-airflow logs-airflow up-db psql-app

up-airflow: ## Start only airflow (postgres must be up)
	$(DC) $(COMPOSE) up -d airflow-webserver airflow-scheduler

restart-airflow: ## Restart webserver + scheduler
	$(DC) $(COMPOSE) restart airflow-webserver airflow-scheduler

logs-airflow: ## Tail airflow logs only
	$(DC) $(COMPOSE) logs -f airflow-webserver airflow-scheduler

up-db: ## Start only postgres
	$(DC) $(COMPOSE) up -d postgres

psql-app: ## psql into app DB (priceradar)
	$(DC) $(COMPOSE) exec postgres psql -U admin -d priceradar

# -------- help --------
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
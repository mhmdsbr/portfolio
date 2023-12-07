ifneq ("$(wildcard ./docker-compose.yml)","")
	include ./docker-compose.yaml
endif

.PHONY: up down restart update

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

update:
	docker compose run --rm node /bin/sh -c 'npm ci && npm run dev'
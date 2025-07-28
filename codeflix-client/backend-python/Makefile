mysql:
	docker compose exec -it mysql mysql --host 127.0.0.1 --port 3306 --user codeflix --password=codeflix --database=codeflix

list-topics:
	docker compose exec -it kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

consume-categories:
	docker compose exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh --topic catalog-db.codeflix.categories --from-beginning --bootstrap-server localhost:9092

consume-topic:
	docker compose exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh --topic $(topic) --from-beginning --bootstrap-server localhost:9092

delete-topic:
	docker compose exec -it kafka /opt/kafka/bin/kafka-topics.sh --delete --topic $(topic) --bootstrap-server localhost:9092

list-connectors:
	curl localhost:8083/connectors/

delete-connector:
	curl -X DELETE localhost:8083/connectors/$(connector)

server-dev:
	fastapi dev src/infra/api/http/main.py --host 0.0.0.0 --port 8000 --reload

graphql-server-dev:
	strawberry server src.infra.api.graphql.schema --port 8001
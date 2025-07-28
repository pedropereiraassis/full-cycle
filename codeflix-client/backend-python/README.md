# Services

This project has some services. The `Makefile` contains some commands to help you manage them.

## Running Services

To run the services, use the following command:

```bash
docker compose up -d
```

# Database

## Connection

To connect to the database, you can use the following command:

```bash
docker compose exec -it mysql mysql --host 127.0.0.1 --port 3306 --user codeflix --password=codeflix --datab
ase=codeflix
```

## Tables

To create the necessary tables and initial data, use the following command in the MySQL shell:

### Categories

```sql
DROP TABLE IF EXISTS categories;

CREATE TABLE categories
(
    id VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO categories (name, description)
VALUES ("Movie", "Category for long movies");
```

### Cast Members

```sql
DROP TABLE IF EXISTS cast_members;

CREATE TABLE cast_members
(
    id VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO cast_members (name, type)
VALUES ("John Doe", "ACTOR");
```

### Genres

```sql
DROP TABLE IF EXISTS genres;

CREATE TABLE genres
(
    id         VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name       VARCHAR(255) NOT NULL,
    is_active  BOOLEAN                 DEFAULT TRUE,
    created_at TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO genres (name)
VALUES ('Drama')
;
```

### Genre Categories

```sql
DROP TABLE IF EXISTS genre_categories;

CREATE TABLE genre_categories
(
    id         VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    genre_id   VARCHAR(36) NOT NULL,
    category_id   VARCHAR(36) NOT NULL,
    FOREIGN KEY (genre_id) REFERENCES genres (id),
    FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT unique_genre_category UNIQUE (genre_id, category_id)
);

INSERT INTO genre_categories (genre_id, category_id)
SELECT g.id, c.id
FROM genres g
JOIN categories c
WHERE g.name = 'Drama'
  AND c.name IN ('Movie', 'Documentary')
;
```

### Videos

```sql
DROP TABLE IF EXISTS videos;

CREATE TABLE videos
(
    id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title       VARCHAR(255) NOT NULL,
    launch_year INT          NOT NULL,
    rating      VARCHAR(10)  NOT NULL,
    is_active   BOOLEAN                 DEFAULT TRUE,
    created_at  TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO videos (title, launch_year, rating)
VALUES ('Pulp Fiction', 1972, 'AGE_18');
```

# Kafka

## Connection

To lists Kafka broker topics, you can use the following command:

```bash
docker compose exec -it kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

# Kafka MySQL Connector

## Register Debezium MySQL Connector

To register the MySQL connector, use the following command:

```bash
curl -i -X POST -H "Accept: application/json" -H "Content-Type: application/json" localhost:8083/connectors/ -d '{
  "name": "debezium",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "database.hostname": "mysql",
    "database.port": "3306",
    "database.user": "root",
    "database.password": "root",
    "topic.prefix": "catalog-db",
    "database.server.id": "1",
    "database.include.list": "codeflix",
    "schema.history.internal.kafka.bootstrap.servers": "kafka:19092",
    "schema.history.internal.kafka.topic": "schema-history.catalog-db"
  }
}'
```

## List Connectors

```bash
curl -X GET http://localhost:8083/connectors
```

# Elasticsearch Server

## Create and Fetch Index for tests

```bash
curl -X PUT "localhost:9200/codeflix"

curl -X POST "localhost:9200/codeflix/_doc/1" -H 'Content-Type: application/json' -d'
{
  "title": "Elasticsearch Sink Connector",
  "description": "Curso de Elasticsearch Sink Connector"
}'

curl -X GET "localhost:9200/codeflix/_doc/1" | jq

curl -X DELETE "localhost:9200/codeflix"
```

# Elasticsearch Sink Connector

## Register Elasticsearch Sink Connector

To register the Elasticsearch Sink Connector, use the following command:

```bash
curl -i -X POST -H "Accept: application/json" -H "Content-Type: application/json" localhost:8083/connectors/ -d '{
  "name": "elasticsearch",
  "config": {
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "tasks.max": "1",
    "topics": "catalog-db.codeflix.categories, catalog-db.codeflix.cast_members, catalog-db.codeflix.genres, catalog-db.codeflix.genre_categories, catalog-db.codeflix.videos",
    "connection.url": "http://elasticsearch:9200",
    "behavior.on.null.values": "delete",
    "key.ignore": "false",
    "transforms": "unwrap,key,cast",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false",
    "transforms.unwrap.drop.deletes": "false",
    "transforms.key.type": "org.apache.kafka.connect.transforms.ExtractField$Key",
    "transforms.key.field": "id",
    "transforms.cast.type": "org.apache.kafka.connect.transforms.Cast$Value",
    "transforms.cast.spec": "is_active:boolean",
    "errors.tolerance": "all",
    "errors.deadletterqueue.topic.name":"dlq_elastic_sink",
    "errors.deadletterqueue.topic.replication.factor": 1,
    "errors.deadletterqueue.context.headers.enable": "true",
    "errors.log.enable": "true"
  }
}'
```

## Confirm on elasticsearch

```bash
curl -X GET "localhost:9200/catalog-db.codeflix.categories/_search" | jq
```

```bash
curl -X GET "localhost:9200/catalog-db.codeflix.cast_members/_search" | jq
```

```bash
curl -X GET "localhost:9200/catalog-db.codeflix.genres/_search" | jq
```

```bash
curl -X GET "localhost:9200/catalog-db.codeflix.genre_categories/_search" | jq
```

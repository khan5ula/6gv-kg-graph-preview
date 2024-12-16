# 6GV

## Description

**_This repository is for a public preview version of the actual repository_**

The purpose of the 6G visible KnowledgeGraph project is to create a knowledge graph that can be used as an aid for decision making.

The system polls data from several APIs to create the knowledge graph. Oulunliikenne GraphQl API is used for plow data, Finnish meteorological institute open WFS API is used for weather point forecasts, Finnish meteorological institute AWS-S3 bucket is used for road index data, and the OpenStreetMap Overpass API is used for road network data.

The system cleans the data to prepare it for storage in the Neo4j graph database where the knowledge graph is saved.
The system allows users to make queries to the knowledge graph for knowledge retrieval.

### Built with

- Neo4j
- Docker

## Getting Started

Setting up the system: [System Setup](/docs/server/README.md)

How to use the system: [User Guide](/docs/application_manual/UserGuide.md)

Useful Cypher commands for neo4j: [Cypher Commands](/docs/application_manual/CypherCheatSheet.md)

## Project Group

- Leevi Alaj&auml;rvi
- Atte Oksanen
- Sakari Partanen
- Kristian Hannula
- Arttu Myllyneva
- Mikko Neuvonen

## License

This project is licensed under the [MIT License](LICENSE).

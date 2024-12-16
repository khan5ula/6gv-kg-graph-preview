# Proposed Neo4j container configuration for the server

Kristian Hannula, 19.3.2024

After trying different setups and learning more about the requirements of the project, I will propose this as the initial setup for the Neo4j docker container used on the server:

```
docker run \
    -p 7474:7474 -p 7687:7687 \
    --name kg-graph \
    --restart always \
    -- detach \
    -e NEO4J_apoc_export_file_enabled=true \
    -e NEO4J_apoc_import_file_enabled=true \
    -e NEO4J_apoc_import_file_use__neo4j__config=true \
    -e NEO4J_PLUGINS=\[\"apoc\"\] \
    -v /srv/neo4j/data:/data \
    -v /srv/neo4j/logs:/logs \
    -v /srv/neo4j/import:/var/lib/neo4j/import \
    -v /srv/neo4j/plugins:/plugins \
    -e NEO4J_AUTH=neo4j/<YOUR_PASSWORD> \
    neo4j:5.18.0
```

It will do the following:

1. Assign port 7474 for Neo4j browser interface
2. Assign port 7687 for incoming data, such as HTTP requests
3. Name the container 'kg-graph'
4. Make the container restart automatically after every reboot
5. Enable importing and exporting data with APOC (mandatory for data-dumps)
6. Installs the APOC extension
7. Defines a local volume for the Neo4j data
8. Defines local import volume for easy importing
9. Defines local plugins volume for easy plugin installation
10. Defines the desired password
11. Pulls the image with Neo4j ver 5.18.0 (latest current version)


This guide provides a simple walkthrough on how to initialize a Neo4J graph database using an RDF file. The guide uses Neo4J with a docker image. The comprehensive Neo4J Neosemantics guide can be found [here](https://neo4j.com/labs/neosemantics/4.0/introduction/).

## 1. Initialize the image

The docker image version 5.15.0 is pulled because it's compatible with the Neosemantics plugin. Neosemantics is mandatory in order to load the RDF into Neo4J.

This setup uses `kg-graph-test` as the name of the container, and `salasana` as the password. It also uses local directories as volumes for data storage. The RDF data to be imported can be placed under `$HOME/neo4j/import`. Download [the Neosemantics plugin](https://github.com/neo4j-labs/neosemantics/releases) and place it under `$HOME/neo4j/plugins`.

```
docker run \
  --name kg-graph-test \
  --restart no \
  -p 7474:7474 -p 7687:7687 \
  -v $HOME/neo4j/data:/data \
  -v $HOME/neo4j/logs:/logs \
  -v $HOME/neo4j/import:/var/lib/neo4j/import \
  -v $HOME/neo4j/plugins:/plugins \
  -e NEO4J_AUTH=neo4j/salasana \
  neo4j:5.15.0
```

## 2. Basic setup

Add `dbms.unmanaged_extension_classes=n10s.endpoint=/rdf` to `<NEO_HOME>/conf/neo4j.conf`. Restart the server.

Step-by-step-guide:

```
docker exec -it kg-graph-test bash
apt update
apt install nano
cd conf
nano neo4j.conf
```

Scroll to the bottom of the file, write `dbms.unmanaged_extension_classes=n10s.endpoint=/rdf`, press `ctrl + x` and `y`. Now you can exit the container with `exit`.

Then, restart:

```
docker stop kg-graph-test
docker start kg-graph-test
```

Next, enter cypher shell by either browser or terminal. Set the default values for the graph with `CALL n10s.graphconfig.init();` and create a mandatory uniqueness constraint: `CREATE CONSTRAINT n10s_unique_uri FOR (r:Resource) REQUIRE r.uri IS UNIQUE;`.

Step by step guide for the terminal:

```
docker exec -it kg-graph-test cypher-shell -u neo4j -p salasana
CALL n10s.graphconfig.init();
CREATE CONSTRAINT n10s_unique_uri FOR (r:Resource) REQUIRE r.uri IS UNIQUE;
:exit
```

The container should now be ready to import RDF data.

## 3. Import RDF data

If you stored the RDF file to `$HOME/neo4j/import`, the file should automatically be inside `/var/lib/neo4j/import` in the container due to the initial setup we made. Next, you can use cypher shell again to import the data:

```
CALL n10s.rdf.import.fetch('file:///var/lib/neo4j/import/data.rdf', 'RDF/XML');
```

The elements should now be in the graph. `MATCH (n) RETURN (n);` should provide some results. You can view the results in graph form using the [browser version](http://localhost:7474/).


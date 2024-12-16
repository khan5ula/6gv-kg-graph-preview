[Full manual for Neo4J Docker Image](https://neo4j.com/docs/operations-manual/current/docker/introduction/)

## Getting started

It is assumed that you have docker working with your system at this point. If `docker` gives some output in your terminal, you should be good to go.

Begin by pulling the official [neo4j image](https://hub.docker.com/_/neo4j):

```
docker pull neo4j
```

Next, you should consider where to store your data. `$HOME/neo4j/data:/data` is recommended. You should also pick a password, you will use it soon.

Now you can start the application:

```
docker run \
    --restart always \
    --publish=7474:7474 --publish=7687:7687 \
    --env NEO4J_AUTH=neo4j/your_password \
    --volume=/path/to/your/data:/data \
    neo4j:5.15.0
```

Let's consider what happens in the snippet above.

`\` This symbol is used solely to break the command into several lines. The snippet is actually a one-liner command.

`--restart always` Sets the container and Neo4J to restart automatically whenever the Docker daemon is restarted. *--Kristian: It is not clear whether this is a desired effect--*

`--publish=7474:7474 --publish=7687:7687` Exposes the default ports required by neo4j. The browser version of neo4j can ba used on [port 7474](http://localhost:7474). Port 7687 seems to be the port that can be used on queries with Neo4J driver. *--Kristian: Havent tried those queries yet*

`--env NEO4J_AUTH=neo4j/your_password` Sets the password. Replace your_password with the password of your choice.

`--volume=/path/to/your/data:/data` Sets the path for persisting data. Replace the path with the datapath you want to use, `$HOME/neo4j/data:/data` for example. If this is not defined, neo4j will not persist data if the service is shut down.

`neo4j:5.15.0` This defines the version of neo4j to use. The documentation recommends using a specific version. Can be used with bare `neo4j` too.

## Getting the name of the container

If the service is running, it should be visible with `docker container ls`. If not, use `docker container ls -a` to list all containers.

```
➜  ~ docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED       STATUS          PORTS                                                                                            NAMES
91360e368d8c   neo4j     "tini -g -- /startup…"   4 hours ago   Up 33 minutes   0.0.0.0:7474->7474/tcp, :::7474->7474/tcp, 7473/tcp, 0.0.0.0:7687->7687/tcp, :::7687->7687/tcp   pedantic_lehmann
```

In this case, the last bit, `pedantic_lehmann` indicates the container name. The name will be different with you. Use the name to interact with the container.


## How to start and stop the container

Stop the container with `docker stop`:

```
➜  ~ docker stop pedantic_lehmann
pedantic_lehmann
```

And start it with `docker start`:
```
➜  ~ docker start pedantic_lehmann               
pedantic_lehmann
```

## Interacting with the contents of the container

In case you need to get inside the container, you need to execute it in `interactive` mode (which can be shortened to `-it`) and run it with `bash`:

```
docker exec -it pedantic_lehmann bash
```

Now you should be inside the container:

```
➜  ~ docker exec -it pedantic_lehmann bash
root@91360e368d8c:/var/lib/neo4j# ls
LICENSE.txt   UPGRADE.txt   data	   lib		   plugins
LICENSES.txt  bin	    import	   licenses	   run
NOTICE.txt    certificates  import.report  logs
README.txt    conf	    labs	   packaging_info
root@91360e368d8c:/var/lib/neo4j# 

```

This is helpful if you want to modify the `config file` which is located in the `conf` directory.

## Importing initial data
The initial import should be done before a database is created.

Follow [this tutorial](https://neo4j.com/docs/operations-manual/current/tutorial/neo4j-admin-import/) to create some seed CSV's and import them to the database. Note that since you're using neo4j with a container, the import command should be:

```
➜  ~ docker exec --interactive --tty pedantic_lehmann neo4j-admin database import full --nodes=import/movies.csv --nodes=import/actors.csv --relationships=import/roles.csv neo4j
```

If the database exists for some reason, use `--overwrite-destination`.

Note that the imported content should be located *inside* the container.

## Doing a sample query

A query `MATCH (n) RETURN count(n) as nodes` should return the number of nodes contained be neo4j.

```
➜  ~ docker exec -it -t pedantic_lehmann cypher-shell --database=neo4j \   
> "MATCH (n) RETURN count(n) as nodes"
+-------+
| nodes |
+-------+
| 6     |
+-------+

1 row
ready to start consuming query after 14 ms, results consumed after another 1 ms
```

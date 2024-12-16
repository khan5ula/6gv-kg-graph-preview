# How to setup Neo4J in the server

Kristian Hannula, 03.04.20204

Previous part: [Part 3 - Setting environment variables](/docs/server/03-environment-variables.md)

---

Ideally the Neo4J knowledge graph container is up and running when you connect to the server. In case it is not, or if you have to reinitialize it, here are the instructions.

## 1. Backup and remove existing data

It is a good practice to check whether there is some data in the knowledge graph that you would like to backup before creating a new container. If there is a Neo4J container up and running, you can check the contents of the graph by navigating to `http://localhost:7474` and querying `MATCH (n) RETURN (n)`.

To backup the existing data, simply move the existing `/srv/neo4j/data` directory away from `/neo4j` directory. There is a `/backup` directory inside `/srv` for this.

Create a new directory of the backup:

```bash
mkdir /srv/backup/06-04
```

Now you can move the existing data to the backup directory. Note that since Neo4J has it's own usergroup, modifying the contents of `/neo4j` directory requires superuser priviledges.

```bash
sudo su
$ type your password
mv /srv/neo4j/data /srv/backup/06-04
exit
```

According to my tests, you can use this backed up data later with neo4j by simply replacing the `/data` directory inside `/neo4j` directory with the backed up `/data` directory.

## 2. Create a new Neo4J container

It's probably easiest to copy the setup below to a text editor, modify it as you see fit and then paste it to the terminal.

Here's the proposed setup:

```bash
docker run \
    -p 7474:7474 -p 7687:7687 \
    --name neo4j \
    --restart unless-stopped \
    --detach \
    --network=kg-graph-network \
    --env-file /srv/env/neo4j \
    -v /srv/neo4j/data:/data \
    -v /srv/neo4j/logs:/logs \
    -v /srv/neo4j/import:/var/lib/neo4j/import \
    -v /srv/neo4j/plugins:/plugins \
    neo4j:5.18.0
```

Here's what the setup does:

#### Port Assignments:

- Port 7474 is used for the Neo4j browser interface.
- Port 7687 is used for incoming BOLT requests.

#### Container Configuration:

- The container is named neo4j for easy reference.

- The container runs in detached mode, allowing continued use of the terminal. Use `docker logs --follow neo4j` to view logs. (if you used a custom name for the container, use that instead of `neo4j`)

#### Network configuration:

- The container is assigned to run in a designated docker network, ensuring it can connect to other containers in the same network.

#### Automatic Restart:

- The container is configured to restart automatically if the server reboots. This behavior is controlled by setting `--restart` policy to `unless-stopped`, which covers automatic restarts upon server reboot but allows for manual stoppage for maintenance without auto-restart.

#### Environment variables

- The container requires some environment variables defined earlier on [Part 3 - Setting environment variables](03-environment-variables).

#### Volume Configuration:

- Local volumes are defined for Neo4j data (`/data` directory), imports, and plugins, ensuring data persistence and ease of data manipulation and plugin installation.
- In order to install new plugins, place the `jar` plugin files to the `/srv/neo4j/plugins` directory. Note that usually the plugins seem to require some configurations in neo4j settings. You can access the neo4j container by `docker exec -it neo4j bash` (if you used a custom name for the container instead of neo4j, replace neo4j with that). Refer to the documentation of the plugin to see what configurations you may need.

#### Image:

- The container uses neo4j:5.18.0, which is the latest version as of this writing.

Next part - [Part 5 - Launch the application](/docs/server/05-launch-application.md)

# Communication between containers

Kristian Hannula, 03.04.2024

Previous part: [Part 5 - Launch the application](/docs/server/05-launch-application.md)

---

## 1. Check the logs

Now that the both containers are up and running, we should check some logs and see if they can communicate with each other properly.

Try entering `docker logs --follow app`

If you get output that looks something like:

```bash
[2024-04-03T05:28:59.721Z] Neo4J connection estabilished: {"address":"neo4j:7687","agent":"Neo4j/5.18.0","protocolVersion":5.4}
[2024-04-03T05:28:59.722Z] Road segment poller: Road segment fetching started
[2024-04-03T05:29:01.729Z] Road segment poller: Returned 11151 segments
[2024-04-03T05:29:01.736Z] Neo4J Service: Populating Neo4J with RoadSegment nodes
[2024-04-03T05:29:01.745Z] Server running on port 3000
[2024-04-03T05:29:05.108Z] Neo4J connection estabilished: {"address":"neo4j:7687","agent":"Neo4j/5.18.0","protocolVersion":5.4}
[2024-04-03T05:29:05.109Z] Road segment poller: Road segment fetching started
[2024-04-03T05:29:07.085Z] Road segment poller: Returned 11151 segments
[2024-04-03T05:29:07.091Z] Neo4J Service: Populating Neo4J with RoadSegment nodes
[2024-04-03T05:29:07.096Z] Server running on port 3000
[2024-04-03T05:29:07.495Z] Neo4J Service: Merged SpeedLimit nodes
```

... then everything seems to work properly.

If you get something like this instead:

```bash
[2024-04-03T05:28:39.556Z] Attempt 1: Could not connect to Neo4J: Neo4jError: Failed to connect to server. Please ensure that your database is listening on the correct host and port and that you have compatible encryption settings both on Neo4j server and driver. Note that the default encryption setting has changed in Neo4j 4.0. Caused by: getaddrinfo ENOTFOUND neo4j
```

Then we need to make sure the containers communicate in the same network.

## 2. Network

If you followed the proposed `docker run` commands with both `app` and `neo4j`, both containers should be using the same `kg-graph-network` network. You can check the existing networks by `docker network ls` and check the specific network with `docker network inspect <NETWORK-NAME>`. Ensure that the both containers are listed in a same network.

If for some reason the containers are not sharing a network, we need to ensure they do. You can use an existing network or create a new one. For the purpose of this manual, let's create a new network.

First, stop the containers for a moment.

```bash
docker stop app
docker stop neo4j
```

Next, create a new network:

`docker network create 6gvisible`

You may choose whatever name you want for the network. 6gvisible is used in this manual.

Then add the containers to the network:

```bash
docker network connect 6gvisible app
docker network connect 6gvisible neo4j
```

Restart the containers:

```bash
docker start neo4j
$ Wait 10-20 seconds to give neo4j some time to boot
docker start app
```

Now, check the logs again:

`docker logs --follow app`

The containers should now be able to communicate with each other. Check `docker logs --follow app` again.

If the first connecion attempt fails, wait a little while. The app will try again to connect to Neo4J multiple times. If the connection seems to keep failing, the source of the problem may lie elsewhere. Double-check that you have passed the correct environment variables to the app. The app needs an username and password for Neo4J, and the port used for the connection. Read the manuals [Part 3 - Setting environment variables](/docs/server/03-environment-variables.md), [Part 4 - How to setup Neo4J in the server](/docs/server/04-setup-neo4j.md) and [Part 5 - Launch the application](/docs/server/05-launch-application.md)

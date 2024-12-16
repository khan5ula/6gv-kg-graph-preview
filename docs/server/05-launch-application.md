# Launch the application

Kristian Hannula, 03.04.2024

Previous part: [Part 4 - How to setup Neo4J in the server](/docs/server/04-setup-neo4j.md)

---

The application runs inside a container. First you should build the image to ensure you're using the latest version. If possible, pull the latest source code from GitHub.

## Building the image

Navigate to `srv/KnowledgeGraph/app`. The Dockerfile required for building is located there. If you have access to the code repository, run `git pull`. Now, run: `docker build -t app .`

## Running the container

Now that the image is created, run the container with the following command:

```bash
docker run \
    --detach \
    --restart unless-stopped \
    --network=kg-graph-network \
    --env-file /srv/env/app \
    -p 3000:3000 \
    --name app app
```

Let's go through the command:

#### Port Assignments:

- Port 3000 is used with the app API, meaning the API can be used with a web browser from address `http://localhost:3000`

#### Container Configuration:

- The container is named app for easy reference.

- The command calls `app` twice in the end. The first gives a name for this container, and the second one refers to the image we created with `docker build`. It has the same name.

- The container runs in detached mode, allowing continued use of the terminal. Use `docker logs --follow neo4j` to view logs. (if you used a custom name for the container, use that instead of `neo4j`)

#### Network configuration:

- The container is assigned to run in a designated docker network, ensuring it can connect to other containers in the same network.

#### Environment variables:

- The container uses environment variables defined in `/srv/env/app` file.

The application should be up and running now. Next, let's check that it works properly.

Next part - [Part 6 - Communication between containers](/docs/server/06-communication-between-containers.md)

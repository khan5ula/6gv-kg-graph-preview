# Begin server setup

Kristian Hannula, 03.04.2024

---

This manual series walks you through the contents of the server and shows how you can set things up if required. This manual contains the following information:

- How to connect to the server -> [part 1](/docs/server/01-connecting-to-server.md)
- How to set up port forwarding from your computer to the server in order to use Neo4J browser console and the application application API -> [part 1](/docs/server/01-connecting-to-server.md)
- Where are the application files located in the server -> [part 2](/docs/server/02-directories.md)
- What components does the application consist of -> [part 2](/docs/server/02-directories.md)
- How to set the environmental variables for the application -> [part 3](/docs/server/03-environment-variables.md)
- How to set the environmental variables for Neo4J -> [part 3](/docs/server/03-environment-variables.md)
- How to backup and delete Neo4J data -> [part 4](/docs/server/04-setup-neo4j.md)
- How to setup and start the Neo4J container -> [part 4](/docs/server/04-setup-neo4j.md)
- How to setup and launch the application -> [part 5](/docs/server/05-launch-application.md)
- How to ensure that the application communicates properly with Neo4J -> [part 6](/docs/server/06-communication-between-containers.md)

Before you delete anything from the `/srv` directory, make sure you've read the instructions carefully and backed up everything you may need later. The source code can be pulled from Github, and Neo4J image is easy to re-fetch. But the information stored in `/srv/env` should not be deleted unless you are sure you have access to all the data you need. There may be some information stored in the env files that are not published in this repository.

Start from [Part 1 - Connecting to the server](/docs/server/01-connecting-to-server.md)

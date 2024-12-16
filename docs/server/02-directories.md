# Directories

Kristian Hannula, 03.04.2024

Previous part: [Part 1 - Connecting to the server](/docs/server/01-connecting-to-server.md)

---

All files required by the application are stored in the `/srv` directory. The directory can be navigated to quickly by entering `cd /srv`.

Inside the directory, there are four subdirectories:

1. `/KnowledgeGraph`, a git clone, containing the source code of the application
2. `/env`, containing environment variables required by the application
3. `/neo4j`, containing files used by the Neo4J knowledge graph, including the database data inside the `data` subdirectory
4. `/backup`, for storing backups of the Neo4J data directory: `/srv/neo4j/data`

Next part: [Part 3 - Setting environment variables](/docs/server/03-environment-variables.md)

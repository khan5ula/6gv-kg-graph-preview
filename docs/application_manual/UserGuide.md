## KnowledgeGraph user guide

## Purpose of the system

The KnowledgeGraph system allows users to make queries to the system to as an aid in decision-making. The system combines road condition related data from multiple different sources and combines it to create possibilities for knowledge retrieval.

The system can be queried through http requests or the Neo4j console on the server. The http method is better for programmatic use, while the Neo4j console method allows users to use the inbuilt Neo4j tools to help understand the structure of the knowledge graph visually.

## Connecting to the system

Users must connect to the server where the system runs using a ssh connection. This requires valid credentials to access the linux server.

The following command connects to the server and also allows the Neo4j console to be used through local ports 7474 and 7687

```sql
ssh -L 7474:localhost:7474 -L 7687:localhost:7687 -L 3000:localhost:3000 <username>@<serverIP>
```

## Using the Neo4j console

If you have a connection to the linux server where the system resides using the command above, you can open the Neo4j console by opening the address `http://localhost:7474/`in your browser of choice (Compatible browsers are Chrome, Firefox and Edge)

To use the Neo4j console the user must input the Neo4j username and password. Then the user can input cypher queries into the console.

Be careful in the use of the console, since it is possible to write and delete data using it. If data is accidentally deleted the system should be restarted so it can repopulate the database.

It is possible to get a license for Neo4j enterprise edition.The enterprise edition has the possibility of permission control, which can help avoid this risk by only allowing read access to the database.

!["Neo4j Console"](/docs/application_manual/manual_images/Neo4jConsole.jpg)

## Sending commands to the system through http

After connecting to the server with ssh it is possible to send http requests to the system.

Users must authenticate themselves by sending a login request to the system.

The login requests use the following structure.

```sql
curl -X POST -H "Content-Type: application/json" -d '{"data": {"username":"<USERNAME>", "password": "<PASSWORD>"}}' http://localhost:3000/login
```

The system will respond with a token string that is required for authorization. This token must be used in other requests to authorize the user.

##### Example response to a successful login request

```
{
    "username": "username",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5lbzRqIiwidGltZXN0YW1wIjoxNzEyNTgxMTM5Mzc1LCJpYXQiOjE3MTI1ODExMzl9.YXJlRlCiaDfeJfTS1Hts3_uy1MJnJ_UMVqko4tkW55Y",
    "loginTime": 1712581139375
}
```

## Command types

### Health

The system responds with status "200 server ok" if the system is running correctly.

```sql
curl http://localhost:3000/health
```

### KG

##### /kg GET

This command returns all of the database contents in JSON format. Replace <TOKEN\> with the token that was returned in the login request. Remove the <> around the token.

```
curl  -H "Authorization: Bearer <TOKEN>" http://localhost:3000/kg/
```

This is the same command except it saves the response contents to a file.

```
curl  -H "Authorization: Bearer <TOKEN>" http://localhost:3000/kg/ -o filename.json
```

### /kg/segments

The kg/segments command returns data relating to the list of roadsegments that it receives as input. The command can be used in two ways, GET and POST. The POST query can contain a longer list of segments within the http message body.

The query only accepts segmentID numbers as input. If a segmentID is not in the database there will be no return for it.

###### /kg/segments GET

```
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/kg/segments?segments=5121913,4752178,4752178,4995627
```

###### /kg/segments POST

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN> -d '{"data":[5121913,4752178,4752178,4995627]}' http://localhost:3000/kg/segments
```

### /kg/route

###### /kg/route GET

The /kg/route command receives a list of coordinates for a route. The DataPoller is called to create a route based on the given coordinates.

This command creates one or more possible routes and returns all of the knowledge relating to the roadsegments on those routes.

```
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:3000/kg/route?coordinates=65.0071,25.4581,65.0125,25.4819"
```

###### /kg/route POST

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"data":[[65.0071, 25.4581],[65.0125, 25.4819]]}' http://localhost:3000/kg/route
```

##### /kg/query POST

This command allows users to send customised read only cypher queries to the system and then returns the results of those queries.

Useful Cypher commands for neo4j: [Cypher Commands](/docs/application_manual/CypherCheatSheet.md)

Remove the <> around the cypher query.

```
curl -X POST \
 -H "Authorization: Bearer <token>" \
 -H "Content-Type: application/json" \
 -d '{"data": {"query": "<VALID CYPHER READ QUERY>"}}' \
 http://localhost:3000/kg/query
```

### Routing

##### /routing/ GET

This command takes list of coordinates as input and queries the Overpass API to generate a route between them. It then returns the route as a list of roadsegments.

```
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/routing?coordinates=64.6345,24.8044,65.2481,26.4462
```

##### /routing/ POST

Has the same functionality as the command above except it receives the coordinates in the http message body instead.

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"data":[[64.6345, 24.8044], [65.2481, 26.4462]]}' http://localhost:3000/routing
```

### /routing/segments

This command receives a list of openstreetmap nodes and calls the overpass API to construct a route between them. It then responds with a list of roadsegments that the route contains.

##### /routing/segments GET

```
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/routing/segments?nodes=207401578,207401581,10093129207,207401582
```

##### /routing/segments POST

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"data":[207401578, 207401581,10093129207, 207401582]}' http://localhost:3000/routing/segments
```

# Visual examples using Postman

The following images show how the system can be queried in a way that is easier to visualize using Postman.

This image shows the way the route of a request is specified at the top. This image also shows where the http request body is located and how it is formatted for a login request. The token that is used for authorization in further requests is highlighted in red.

!["Login query"](/docs/application_manual/manual_images/LoginQueryPostman.jpg)

This image shows where the http request headers are configured. In this case the login request is of the content-type: application/json

!["Login query headers"](/docs/application_manual/manual_images/LoginQueryHeadersPostman.jpg)

This image shows how cypher queries can be sent to the system and the way they must be formatted.
!["Login query headers"](/docs/application_manual/manual_images/KgQueryExamplePostman.jpg)

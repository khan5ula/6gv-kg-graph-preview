# Setting environment variables

Kristian Hannula, 03.04.2024

Previous part: [Part 2 - Directories](/docs/server/02-directories.md)

---

The application and Neo4J service both rely on some environment variables in order to work properly. There is a `env` directory inside `/srv` directory. There should be two files inside `/env` directory:

1. `app`
2. `neo4j`

If not, create them. Now, let's go through both of those files to see what values they should contain.

## 1. app

The structure of the `app` file should be as follows:

```bash
NEOURI=bolt://neo4j:7687/
NEOUSER=neo4j
NEOPASS=<NEO4J-PASSWORD>
BBOX=64.6345, 24.8044, 65.2481, 26.4462
ROAD_INDEX_CRON=0 */3 * * *
PLOW_CRON=0 */3 * * *
POINT_FORECAST_CRON=0 10 * * *
ANNOUNCEMENT_CRON= "*/15 * * * *"
FMI_URL=<SECRET-RECEIVED-FROM-FMI>
API_USERNAME=<YOUR-API-USERNAME>
API_PASSWORD=<YOUR-API-PASSWORD>
API_SECRET=<YOUR-API-SECRET>
CREATE_MOCK_DATA=false
DIGITRAFFIC_URL=""
```

Let's go through the setup.

#### Neo4J credentials

- NEOURI tells our app which URI to use in order to connect to Neo4J. [Bolt protocol](https://neo4j.com/docs/bolt/current/bolt/) is used to connect to the container named `neo4j` to port `7687`. If you used different name for the Neo4J container or different port for Neo4J, change the settings accordingly.
- NEOUSER is the username for the Neo4J instance. The default username is neo4j. You may choose another name if you want, but make sure you reflect this change on other places that may require Neo4J username (such as the neo4j env file).
- NEOPASS is the password for you Neo4J graph. Make sure to pick a secure password.

#### Bounding box

- These coordinate tuples define the area of the bounding box used by the application in order to fetch the road segments and related information from a certain area. The recommended value is `64.6345, 24.8044, 65.2481, 26.4462` due to the restraints of the API's used in the current version of the app. You can experiment with different values.

#### Timing

- The application uses [CRON](https://crontab.guru/) syntax to define the timing of the data polling due to the universal nature of CRON. If the entered CRON value is invalid, the app reverts to use fallback values.

#### FMI URL

- This URL is used for the app to connect to the FMI's road index api. The URL is not to be published in the repository. If you do not have the url, contact Virve @ FMI.

#### App authentication

- The app uses token based authentication. Provide an username and password that you would like to use for authentication. Also, provide an api_secret digit to be used on the token hashing. You can pass virtually any value, eg: `123`.

#### Allow or disallow mock plow data

- The api for the plow data has proven to be extremely unreliable. Oftentimes the polling fails, resulting in no data for the plow information. The app is able to generate mock plowing data. Use `true` if you would like to allow mock data, use `false` if not.

## 2. neo4j

The structure of the `neo4j` file should be as follows:

```bash
NEO4J_apoc_export_file_enabled=true
NEO4J_apoc_import_file_enabled=true
NEO4J_apoc_import_file_use__neo4j__config=true
NEO4J_PLUGINS=["apoc"]
NEO4J_AUTH=neo4j/<NEO4J-PASSWORD>
```

#### Plugins:

- APOC extension installation is enabled.
- APOC can be used to take backup dumps of the database with `CALL apoc.export.csv.all("datadump.csv", {})` command. The exported data goes to the `/srv/neo4j/import` directory.
- Further APOC functions are not used in the current version of this app, and our manuals do not cover them. However, they may prove to be useful in the future of the application. [Check the APOC docs here](https://neo4j.com/labs/apoc/).

#### Credentials:

- `NEO4J_AUTH` sets the credentials for this Neo4J instance. Our setup proposes the default username `neo4j`, but you may choose differently. Important! Make sure you use the same neo4j username on both env files `app` and `neo4j`. For the password, enter the same password used on the `app` env.

Next part: [Part 4 - How to setup Neo4J in the server](/docs/server/04-setup-neo4j.md)

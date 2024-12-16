# Data licensing

Atte Oksanen, 12.3.2024

## OpenStreetMap/Overpass/OSRM

### Data

Road network data that acts as the base structure of the knowledge graph (KG).
The data is accessed via Overpass-API, but the use of Overpass does not fall under any license.
The routing is done with OSRM, but the use is not licensed separately.

### Licence

[ODbL v1.0](https://opendatacommons.org/licenses/odbl/1-0/) (Open Data Commons Open Database License)

### Licence restrictions

- Free to share: To copy, distribute and use the database.
- Free to create: To produce works from the database.
- Free to adapt: To modify, transform and build upon the database.

[Source](https://opendatacommons.org/licenses/odbl/summary/)

### Licence requirements

- Attribute: You must attribute any public use of the database, or works produced from the database, in the manner specified in the ODbL. For any use or redistribution of the database, or works produced from it, you must make clear to others the license of the database and keep intact any notices on the original database.
- Share-Alike: If you publicly use any adapted version of this database, or works produced from an adapted database, you must also offer that adapted database under the ODbL.
- Keep open: If you redistribute the database, or an adapted version of it, then you may use technological measures that restrict the work (such as DRM) as long as you also redistribute a version without such measures.

[Source](https://opendatacommons.org/licenses/odbl/summary/)

<div style="page-break-after: always;"></div>

### Effects on this project

The Neo4j database could be concidered as a *collective database* that incorporates a *derivative database* as stated in **1.0**.
As is stated in **4.5.a**, the license does not apply to the *collective database*, just the *derivative database* in it.
Before the research is published, the use of the Neo4j database would not be concidered *public* as described in **1.0**,
so it would not fall under this license, stated in **4.5.c**.
After the publishing, if the use becomes interorganizational, it would be concidered as *public use*.

The licence does not apply to computer programs used in the making or operation of the database, stated in **2.3**,
meaning that the source code created to operate the database, i.e. extracting road network data,
does not fall under this licence and could be licensed with a separate license.

There is also an exception to the *Database Right* in section **6.1.a**,
excluding the use for scientific research as applicable under the license,
but it only affects the database structure, not the data itself.

The project must include a notice as stated in **4.2**.
The notice must include the license text, in a hyperlink or plain text,
and the notice must be in a directory *"where users would be likely to look for it"*, stated in **4.2.b-d**.
If the use of the database is made *public*,
the responses from the Neo4j database must include attribution to the OpenStreetMap database, stated in **4.3**,
as the responses are concidered as *produced work*, defined in **1.0**.

In any research published on this subject,
all of the images, data, etc. used from the KG are concidered as *produced work*,
and must be atrributed in accordance to **4.3**.

#### Summary

The Neo4j database can be licensed under any license,
as long as the road network data in it is still freely accessible,
which it will be from the OpenStreetMap database directly or from the Overpass-API.

The code used to operate the database is fully exempt from the restriction of this license.

The repository should contain the license text in full, preferably in the README,
as it is the most common place for users to look for it.

<div style="page-break-after: always;"></div>

## Oulunliikenne.fi

### Data

Plow data in the Oulu region.

### License

No formal license.

### Restrictions

- The user utilizes the information in accordance with the laws and regulations applicable in Finland.
- The user uses the data at their own risk, meaning that the provider and producer of Oulunliikenne.fi service, as well as the original measurement data producer, are not responsible for any costs or damages incurred by the user due to the use of the data or potential deficiencies or interruptions in data.
- The user is obligated to follow any instructions and clarifications provided by the provider and producer of the Oulunliikenne.fi service. Failure to comply with the instructions prevents the utilization of the data.

[Source](https://wp.oulunliikenne.fi/avoin-data/rajapintojen-kayttooikeusehdot/)

### Effects in this project

There are no legal or license related effects.
It is good practice to attribute the data source,
so there should be an attribution in the README of the repository.

## FMI closed data

### Data

Forecast data based on the [road weather model](https://en.ilmatieteenlaitos.fi/road-weather-model).

### License

No formal license, but the data is a product for sale, so caution when using is recommended.

### Effects on this project

Attribution to the README will be added.

## FMI open data

### Data

Forecast data from the public FMI API.

### License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (The Creative Commons Attribution 4.0 International license)

### License restrictions

- Free to copy and redistribute the material in any medium or format for any purpose, even commercially.
- Free to remix, transform, and build upon the material for any purpose, even commercially.

[Source](https://creativecommons.org/licenses/by/4.0/)

### License requirements

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

### Effects on this project

The use of FMI data must be attributed in the README of the project.
The transformations done to the data must be excplicitly stated as well.

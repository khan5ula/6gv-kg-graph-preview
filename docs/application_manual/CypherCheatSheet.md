## Cypher command cheatsheet

Neo4j cypher documentation: https://neo4j.com/docs/cypher-manual/current/introduction/

Free online courses on the usage of neo4j and the cypher query language: https://graphacademy.neo4j.com/

Returns all nodes

```sql
Match (n) Return n
```

Returns all roadsegments that have weatherstation

```sql
MATCH (roadSegment:RoadSegment)-[:HAS_ROADWEATHER_STATION]-(w:WeatherStation)
return roadSegment
```

Returns all roadsegments that have speedlimit of 80 or more

```sql
MATCH (roadSegment:RoadSegment)-[:HAS_SPEEDLIMIT]->(s:SpeedLimit)
WHERE s.value >= 80
return roadSegment, s
```

Returns all roadsegments that have plow data

```sql
MATCH (roadSegment:RoadSegment)
WHERE roadSegment.plowed IS NOT NULL
return roadSegment
```

Returns all nodes connected to given roadsegment list. (in this example [5121913,4752178,4995627,76131247])

```sql
MATCH (roadSegment:RoadSegment)-[r*..]->(connectedData)
WHERE roadSegment.segmentId IN [5121913,4752178,4995627,76131247]
RETURN roadSegment, connectedData
```

Returns all latest WeatherStation forecasts for roadsegments

```sql
WITH datetime() AS currentDateTime
WITH datetime({ year: currentDateTime.year,
    month: currentDateTime.month,
    day: currentDateTime.day,
    hour: currentDateTime.hour + 3  }) AS roundedDownDateTime
MATCH (roadSegment:RoadSegment)-[]->(w:WeatherStation)-[]->(forecast:StationForecast)
WHERE forecast.time = roundedDownDateTime
RETURN roadSegment, forecast, w
```

Same as above but for pointforecast

```sql
WITH datetime() AS currentDateTime
WITH datetime({ year: currentDateTime.year,
    month: currentDateTime.month,
    day: currentDateTime.day,
    hour: currentDateTime.hour + 3 }) AS roundedDownDateTime
MATCH (roadSegment:RoadSegment)-[]->(forecast:PointForecast)
WHERE forecast.time = roundedDownDateTime
RETURN roadSegment, forecast
```

Returns all the data for given roadsegments with only returning the latest pointforecast and weatherstation forecast

(in this example [5121913,4752178,4995627,76131247, 119872755])

```sql
WITH datetime() AS currentDateTime
WITH datetime({ year: currentDateTime.year,
    month: currentDateTime.month,
    day: currentDateTime.day,
    hour: currentDateTime.hour + 3 }) AS roundedDownDateTime
MATCH (roadSegment:RoadSegment)-[*]->(connectedData)
WHERE roadSegment.segmentId IN [5121913,4752178,4995627,76131247, 119872755]
OPTIONAL MATCH (roadSegment:RoadSegment)-[]->(forecast:PointForecast)
WHERE forecast.time = roundedDownDateTime
OPTIONAL MATCH (roadSegment:RoadSegment)-[:HAS_SPEEDLIMIT]->(s:SpeedLimit)
OPTIONAL MATCH (roadSegment:RoadSegment)-[:HAS_ROADWEATHER_STATION]->(w:WeatherStation)-[:HAS_STATION_FORECAST]->(sf:StationForecast)
WHERE sf.time = roundedDownDateTime
OPTIONAL MATCH (roadSegment:RoadSegment)-[:HAS_SURFACETYPE]->(st:SurfaceType)
OPTIONAL MATCH (roadSegment:RoadSegment)-[:HAS_ROADTYPE]->(r:RoadType)
RETURN roadSegment, forecast, s, w, sf,st,r
```

Returns roadsegments that don't have snow

```sql
MATCH (rs:RoadSegment)-[:HAS_POINT_FORECAST]->(pf:PointForecast)
WHERE NOT pf.precipitationType = "snow"
RETURN rs, pf
LIMIT 100
```

Returns roadsegments that have snow

```sql
MATCH (rs:RoadSegment)-[:HAS_POINT_FORECAST]->(pf:PointForecast)
WHERE pf.precipitationType = "snow"
RETURN rs, pf
LIMIT 100
```

Returns all the roadsegments from a list (In this example: [5121913,4752178,4995627,76131247,119872755]) that have been plowed in last 5 hours
(-2 because Finland +3 utc)

```sql
WITH datetime() AS currentDateTime
WITH datetime({ year: currentDateTime.year,
    month: currentDateTime.month,
    day: currentDateTime.day,
    hour: currentDateTime.hour -2 }) AS roundedDownDateTime
MATCH (roadSegment:RoadSegment)-[*]->(connectedData)
WHERE roadSegment.segmentId IN [5121913,4752178,4995627,76131247,119872755] AND roadSegment.plowed >= roundedDownDateTime
return roadSegment, connectedData
```

Returns latest weatherstation forecasts that have a dry road for given roadsegments (In this example: [5121913,4752178,4995627,76131247,119872755])

```sql
WITH datetime() AS currentDateTime
WITH datetime({ year: currentDateTime.year,
month: currentDateTime.month,
day: currentDateTime.day,
hour: currentDateTime.hour + 3 }) AS roundedDownDateTime
MATCH (roadSegment:RoadSegment)-[:HAS_ROADWEATHER_STATION]->(w:WeatherStation)-[:HAS_STATION_FORECAST]->(sf:StationForecast)
WHERE roadSegment.segmentId IN [5121913,4752178,4995627,76131247,119872755] AND sf.time = roundedDownDateTime AND sf.roadCondition = "dry road"
return roadSegment, w, sf
```

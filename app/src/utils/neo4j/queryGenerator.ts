/**
 * Function that creates a Cypher query as a string.
 * The query returns everything that the database contains.
 */
const getAll = () => {
  return 'MATCH (n)-[r*..]->(a) RETURN n, a, r'
}

/**
 * Function that creates a Cypher query as a string.
 * The query returns all desired RoadSegment nodes with all
 * relations and relating nodes recursively.
 * @param idArray number[] SegmentId's of the desired RoadSegments
 */
const matchBySegmentId = (idArray: number[]) => {
  return `
        MATCH (rs:RoadSegment)-[r*..]->(n)
        WHERE rs.segmentId IN ${JSON.stringify(idArray)}
        RETURN rs, r, n                
      `
}

/**
 * Function that creates a Cypher query as string.
 * Goes through forecast data, creates PointForecast
 * nodes and links them to RoadSegment nodes with
 * HAS_POINT_FORECAST relation.
 * @author Kristian Hannula
 */
const linkPointForecasts = () => {
  return `
          UNWIND $forecastsData AS forecast
          MATCH (rs:RoadSegment { segmentId: forecast.segmentId })
          USING INDEX rs:RoadSegment(segmentId)
          CREATE (pf:PointForecast {
          time: datetime({epochMillis: forecast.time}),
          temperature: forecast.temperature,
          precipitation: forecast.precipitation,
          precipitationPerHour: forecast.precipitationPerHour,
          precipitationType: forecast.precipitationType,
          windSpeed: forecast.windSpeed,
          windDirection: forecast.windDirection
        })
        SET pf.alias = "PointForecast"
        CREATE (rs)-[:HAS_POINT_FORECAST]->(pf)
      `
}

/**
 * Function that creates a Cypher query for adding plowing data to RoadSegment nodes
 * @returns {string}
 * @author Atte Oksanen
 */
const linkPlowData = () => {
  return `
          UNWIND $plowLinks AS plowData
          MATCH (rs:RoadSegment {segmentId: plowData.segmentId})
          USING INDEX rs:RoadSegment(segmentId)
          SET rs.plowed = datetime({epochMillis: plowData.timestamp})
        `
}
/**
 * Function that creates a Cypher query for connecting traffic announcements to RoadSegment nodes 
 * @returns {string}
 * @author Arttu Myllyneva
 */
const linkAnnouncements = () => {
  return`
  UNWIND $announcements AS announcement
UNWIND announcement.geometry AS coordinatepair
// Find nodes within the distance threshold
MATCH (o:OSMnode)
WHERE point.distance(o.coordinates, point({ srid: 4326, longitude: coordinatepair[0], latitude: coordinatepair[1] })) < 10
WITH o, announcement, coordinatepair,
     point.distance(o.coordinates, point({ srid: 4326, longitude: coordinatepair[0], latitude: coordinatepair[1] })) AS distance
// Use APOC to find the closest node among those within the threshold
WITH announcement, coordinatepair, apoc.agg.minItems(o, distance) AS closestNode
WHERE closestNode.items[0] IS NOT NULL // Ensure there is at least one node within the distance

WITH closestNode.items[0] AS o, announcement
// Continue processing with the closest node
MATCH (rs:RoadSegment)-[:INCLUDES]-(o)
WITH DISTINCT rs, announcement

// Builds a list of points for geometry
WITH rs, announcement, [p IN announcement.geometry | point({ srid: 4326, longitude: p[0], latitude: p[1] })] AS geometryPoints

MERGE (ta:TrafficAnnouncement {
    announcementid: announcement.id,
    title: announcement.title,
    announcementType: announcement.announcementType,
    startTime: announcement.startTime, 
    endTime: announcement.endTime, 
    estimatedDuration: announcement.estimatedDuration,
    municipality: announcement.municipality,
    geometry: geometryPoints,  // Store as list of Points
    announcementFeatures: announcement.announcementFeatures
})
MERGE (ta)-[:HAS_ANNOUNCEMENT]-(rs)
RETURN rs, ta

  `
}

/**
 * Function that finds the given Nodes by label
 * from Neo4J, detaches all relations from them
 * and finally deletes the nodes.
 * @author Kristian Hannula
 */
const simpleDelete = (label: string) => {
  return `MATCH (n: ${label}) DETACH DELETE (n)`
}

/**
 * Creates a search index based on RoadSegment id numbers to improve MATCH efficiency.
 * @returns {string}
 * @author Atte Oksanen
 */
const createRoadIdIndex = (): string => {
  return 'CREATE INDEX roadId IF NOT EXISTS FOR (rs:RoadSegment) ON (rs.segmentId)'
}

const createNodeIdIndex = (): string => {
  return 'CREATE INDEX OMSnodeId IF NOT EXISTS FOR (n:OSMnode) ON (n.nodeId)'
}

const createPointIndex = (): string  => {
  return 'CREATE POINT INDEX point_index_coordinates IF NOT EXISTS for (o:OSMnode) on o.coordinates'
}

export const queryGenerator = {
  getAll,
  matchBySegmentId,
  linkPointForecasts,
  simpleDelete,
  createRoadIdIndex,
  createNodeIdIndex,
  createPointIndex,
  linkPlowData,
  linkAnnouncements,
}

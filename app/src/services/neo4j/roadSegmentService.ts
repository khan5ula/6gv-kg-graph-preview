import { Driver, Session } from 'neo4j-driver'
import { roadTypes, speedLimits, surfaceTypes } from '../../dataTemplates/segmentAttributes'
import { SegmentWithNodes } from '../../types/roadSegmentTypes'
import { mergeNodesFromList } from '../../utils/neo4j/mergeNodesFromList'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'
import { queryGenerator } from '../../utils/neo4j/queryGenerator'

/**
 * Function that receives an array of road segment objects integrates
 * them into a Neo4J knowledge graph. Nodes are created or merged
 * (if one with matching id is found), and relationships are established
 * with relevant nodes such as: SpeedLimit, SurfaceType, RoadType.
 * @param segments RoadSegment[]: An array of RoadSegment objects that
 * contain information about each road segment, including its id,
 * center point and tags.
 * @param neodriver Driver: An instance of the Neo4J driver used to
 * connect to and interact with the Neo4J knowledge graph.
 * @returns Promise<boolean>: The function returns a promise that
 * resolves to true if the road segments were successfully integrated
 * into the Neo4j knowledge graph. If an error occurs during the process,
 * the promise will reject with the encountered error.
 * @author Kristian Hannula, Atte Oksanen, Arttu Myllyneva
 */
export const handleRoadSegments = async (segments: SegmentWithNodes[], neodriver: Driver): Promise<boolean> => {
  const session: Session = neodriver.session()

  logWithTimestamp(`Neo4J Service: Populating Neo4J with RoadSegment nodes`)

  try {
    /**
     * Create a bunch of 'Singleton' nodes used by the RoadSegment nodes:
     *
     * SpeedLimit
     * SurfaceType
     * RoadType
     * RoadCondition
     */
    await mergeNodesFromList(speedLimits, 'SpeedLimit', session)
    await mergeNodesFromList(surfaceTypes, 'SurfaceType', session)
    await mergeNodesFromList(roadTypes, 'RoadType', session)

    logWithTimestamp(`Neo4J Service: Going through individual road segments...`)
    
    

    /**
     * Neo4j Cypher query that adds the RoadSegment and OSMnode elements into the database and links them.
     * Uses the segments object as a parameter for the segmentQuery.
     */

     const segmentQuery: String = (`
      UNWIND $segments AS rsnodes
      MERGE (rs:RoadSegment {segmentId: rsnodes.id})
      SET rs.centerpoint = point({srid:4326, latitude: rsnodes.centerPoint.latitude, longitude: rsnodes.centerPoint.longitude}),
      rs.alias = "RoadSegment"
      WITH rs, rsnodes
      MATCH (sl:SpeedLimit {value: rsnodes.tags.maxspeed}),
            (st:SurfaceType {value: rsnodes.tags.surface}),
            (rt: RoadType {value: rsnodes.tags.highway})
      MERGE (rs)-[:HAS_SPEEDLIMIT]-(sl)
      MERGE (rs)-[:HAS_SURFACETYPE]-(st)
      MERGE (rs)-[:HAS_ROADTYPE]->(rt)   
      with rsnodes, rs
      UNWIND rsnodes.nodes AS n
      MERGE (node:OSMnode {nodeId: n.id})
      SET node.coordinates = point({srid: 4326, latitude: n.latitude, longitude: n.longitude})
      MERGE (rs)-[:INCLUDES]->(node);
      `)
    await session.executeWrite(tx => tx.run(segmentQuery, {segments}))

    await session.run(queryGenerator.createRoadIdIndex())
    logWithTimestamp(`Neo4J Service: Created search index for RoadSegment ids`)
    await session.run(queryGenerator.createNodeIdIndex())
    await session.run(queryGenerator.createPointIndex())
    logWithTimestamp(`Neo4J Service: RoadSegment nodes processed`)
    return true
  } catch (error) {
    errorWithTimeStamp(`Neo4J Service: Error processing RoadSegment data: ${error}`)
    throw error
  } finally {
    await session.close()
  }
}

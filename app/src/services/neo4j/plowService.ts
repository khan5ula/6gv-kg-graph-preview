import neo4j, { Driver, Session } from 'neo4j-driver'
import { PlowDataLink } from '../../types/plowDataTypes'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'
import { queryGenerator } from '../../utils/neo4j/queryGenerator'

/**
 * Function that receives an array of plowed data links and updates
 * the plowed attributes of the RoadSegment nodes to accordingly with
 * the provided timestamp. The given timestamp is converted to ISO 8601
 * format using Neo4j's datetime() function.
 * @param plowDataLinks PlowDataLink[]: An array of PlowDataLink objects
 * that contain information of which RoadSegment node will be updated with
 * which timestamp.
 * @param neodriver Driver: An instance of the Neo4J driver used to
 * connect to and interact with the Neo4J knowledge graph.
 * @returns Promise<boolean>: The function returns a promise that resolves
 * to true if the plowed timestamps were successfully updated in the Neo4j
 * knowledge graph. If an error occurs during the process, the promise will
 * reject with the encountered error.
 * @author Kristian Hannula, Atte Oksanen
 */
export const handlePlowLinks = async (plowDataLinks: PlowDataLink[], neodriver: Driver): Promise<boolean> => {
  const session: Session = neodriver.session()

  logWithTimestamp(`Neo4J Service: Inserting Plowed timestamps to RoadSegment nodes`)

  try {
    const plowLinks = plowDataLinks.map(link => {
      return {
        segmentId: link.roadSegmentId,
        timestamp: neo4j.int(link.time)
      }
    })

    await session.run(queryGenerator.linkPlowData(), { plowLinks })
    logWithTimestamp('Neo4J Service: Plowed timestamps were successfully processed')
    return true
  } catch (error) {
    errorWithTimeStamp(`Neo4J Service: Error processing the plow data: ${error}`)
    throw error
  } finally {
    await session.close()
  }
}

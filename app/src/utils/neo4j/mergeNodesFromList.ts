import { SpeedLimit, Surface, RoadType } from '../../types/roadSegmentTypes'
import { Session } from 'neo4j-driver'
import { errorWithTimeStamp, logWithTimestamp } from '../logWithTimeStamp'

/**
 * A function that merges the given elements to Neo4J by formulating a Cypher query.
 * @param list The source list of the elements. Eg. an array of different speed limits.
 * @param label The label of the node. Also used as the node 'Type'
 * @param session The Neo4J session to be used. Requires a Neo4J driver.
 * @returns {Promise<void>} Promise
 * @author Kristian Hannula
 */
export const mergeNodesFromList = async (list: SpeedLimit[] | Surface[] | RoadType[], label: string, session: Session): Promise<void> => {
  try {
    for (const element of list) {
      const query = `
          MERGE (el:${label} {Type: $Type, value: $elementValue})
        `

      await session.run(query, {
        Type: label,
        elementValue: element,
      })
    }
  } catch (error) {
    errorWithTimeStamp(`Neo4J Service: Error occured while merging nodes from a list! : ${error}`)
    throw error
  }

  logWithTimestamp(`Neo4J Service: Merged ${label} nodes`)
}

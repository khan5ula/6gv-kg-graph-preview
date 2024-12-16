import { Session } from 'neo4j-driver'
import { LatLonTuple } from '../types/geoSpatialTypes'
import { RouteLeg } from '../types/routeTypes'
import { RecordShape } from 'neo4j-driver'
import { dataPoller } from '../services/dataPollerService'
import { queryGenerator } from './neo4j/queryGenerator'

/**
 * Utility function for querying multiple legs of routes
 * @param {Session} session
 * @param {LatLonTuple[]} waypoints
 * @returns {Promise<{ route: RouteLeg, records: RecordShape[] }[]>} All data connected to all routes
 */
export const pollKGWithCoords = async (session: Session, waypoints: LatLonTuple[]): Promise<{ route: RouteLeg; records: RecordShape[] }[]> => {
  const allRoutes: { route: RouteLeg; records: RecordShape[] }[] = []
  const routeWithSegments = await dataPoller.getRoute(waypoints)
  //loop trought all the route options and return the data
  for (let i = 0; i < routeWithSegments.legs.length; i++) {
    // Create query based on route
    const neo4jQuery = queryGenerator.matchBySegmentId(routeWithSegments.legs[i].roadSegmentIds)
    // Query data from knowledge graph
    const result = await session.executeRead((tx) => tx.run(neo4jQuery))
    const records = result.records.map((record) => record.toObject())
    allRoutes.push({ route: routeWithSegments.legs[i], records: records })
  }
  return allRoutes
}

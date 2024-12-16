import axios, { AxiosError } from 'axios'
import { LatLonTuple } from '../../types/geoSpatialTypes'
import { RouteApiReturnObject, RouteLeg, RouteWithRoadSegments } from '../../types/routeTypes'
import { OverpassReturnObject } from '../../types/roadSegmentTypes'
import { roadTypes } from '../../dataTemplates/segmentAttributes'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

/**
 * A function for getting a route between two coordinates, and the RoadSegment object ids that the route uses.
 * @async
 * @param {LatLonTuple[]} waypoints A list of waypoints, starting from the beginning of the route
 * @returns {number[]} Array of RoadSegment ids that are along the route. Returned data under ODbl-1.0 license https://opendatacommons.org/licenses/odbl/
 * @throws {AxiosError} throws if there are no possible routes between waypoints
 * @author Atte Oksanen
 */
export const getRoute = async (waypoints: LatLonTuple[]): Promise<RouteWithRoadSegments> => {
  const routeApiUrl = getRouteApiUrl(waypoints)
  try {
    const routeData: RouteApiReturnObject = (await axios.get(routeApiUrl)).data
    const routesWithSegments: RouteLeg[] = []
    for (let i = 0; i < routeData.routes.length; i++) {
      const routeLegs = routeData.routes[i].legs
      const legWithSegments: number[] = []
      for (let y = 0; y < routeLegs.length; y++) {
        const nodeIds = routeLegs[y].annotation.nodes
        legWithSegments.push(...(await getRouteSegments(nodeIds)))
      }
      routesWithSegments.push({ leg: i, roadSegmentIds: legWithSegments })
    }
    return { legs: routesWithSegments }
  } catch (error) {
    throw new AxiosError('No possible route found', '400')
  }
}

/**
 * A function for polling road segment ids from a list of nodes
 * @async
 * @param {number[]} routeNodes 
 * @returns {Promise<number[]>} An array of road segment ids. Returned data under ODbl-1.0 license https://opendatacommons.org/licenses/odbl/
 * @author Atte Oksanen
 */
export const getRouteSegments = async (routeNodes: number[]): Promise<number[]> => {
  const overpassResult: OverpassReturnObject = (await axios.post(OVERPASS_URL, createOqlQuery(routeNodes))).data
  const wayObjects = overpassResult.elements.filter((overpassElement) => overpassElement.type === 'way' && roadTypes.includes(overpassElement.tags.highway) && checkArrayOverlap(overpassElement.nodes, routeNodes))
  return wayObjects.map((element) => element.id)
}

const getRouteApiUrl = (waypoints: LatLonTuple[]) => {
  return `https://router.project-osrm.org/route/v1/driving/${waypoints.map(coordPair => coordPair.reverse().toString()).join(';')}?alternatives=true&annotations=nodes`
}

const createOqlQuery = (nodes: number[]): string => {
  return 'data=' + encodeURIComponent(`[out:json];(node(id:${nodes.toString()});<;);out body;`)
}

const checkArrayOverlap = (arr1: number[], arr2: number[]): boolean => {
  const smallerArray = arr1.length < arr2.length ? arr1 : arr2
  const largerArray = new Set(arr1.length > arr2.length ? arr1 : arr2)
  let foundOne = false
  for (let i = 0; i < smallerArray.length; i++) {
    if (largerArray.has(smallerArray[i])) {
      if (foundOne) {
        return true
      }
      foundOne = true
    }
  }
  return false
}

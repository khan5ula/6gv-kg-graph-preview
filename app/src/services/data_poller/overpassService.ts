import axios from 'axios'
import { OverpassReturnObject, SegmentWithNodes, SpeedLimit } from '../../types/roadSegmentTypes'
import { getCenter } from 'geolib'
import { BoundingBox } from '../../types/geoSpatialTypes'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'

const API_URL = 'https://overpass-api.de/api/interpreter'
const boundingBoxDefault = [
  [64.7, 25.2486],
  [65.1968, 25.9491],
]

/**
 * Function for fetching Way-elements from Overpass-API and transforming them into road segment objects with nodes.
 * @async
 * @param {BoundingBox} boundingBox
 * @returns {SegmentWithNodes[]} An array of road segments with nodes. If an exception occurs the array will be returned empty. Returned data under ODbl-1.0 license https://opendatacommons.org/licenses/odbl/
 * @author Atte Oksanen
 */

export const fetchSegmentData = async (boundingBox: BoundingBox): Promise<SegmentWithNodes[]> => {
  logWithTimestamp('Road segment poller: Road segment fetching started')
  try {
    boundingBox = boundingBox ?? boundingBoxDefault
    const resultObject: OverpassReturnObject = (await axios.get(API_URL, { data: createOqlQuery(boundingBox.toString()) })).data
    const wayElements = resultObject.elements.filter((element) => element.type === 'way')
    const roadSegments: SegmentWithNodes[] = []
    for (let i = 0; i < wayElements.length; i++) {
      const nodes = wayElements[i].nodes
        .map((nodeElement, index) => {
          return { id: nodeElement, ...wayElements[i].geometry[index] }
        })
        .filter((nodeElement) => nodeElement.lon != null && nodeElement.lat != null)
        .map((nodeElement) => {
          return { latitude: nodeElement.lat, longitude: nodeElement.lon, id: nodeElement.id }
        })
      const centerPoint = getCenter(nodes)
      if (!centerPoint) {
        throw new Error('Missing coordinate data')
      }
      const roadSegment: SegmentWithNodes = {
        id: wayElements[i].id,
        nodes: nodes,
        centerPoint: centerPoint,
        tags: {
          highway: wayElements[i].tags.highway,
          maxspeed: Number(wayElements[i].tags.maxspeed) as SpeedLimit,
          surface: !wayElements[i].tags.surface ? undefined : getRoadSurfaceType(wayElements[i].tags.surface),
        },
      }
      roadSegments.push(roadSegment)
    }
    logWithTimestamp(`Road segment poller: Returned ${roadSegments.length} segments`)
    return roadSegments
  } catch (error) {
    errorWithTimeStamp(`Bad request to Overpass API, no road segments returned: ${error}`)
    return []
  }
}

const createOqlQuery = (boundingBox: string): string => {
  return (
    'data=' +
    encodeURIComponent(
      `[out:json];(way["highway"]["highway"~"^(unclassified|trunk|motorway|primary|secondary|tertiary|residential)$"]["bicycle"!="designated"](${boundingBox});<;);(._;<;);out geom(${boundingBox}) body;`
    )
  )
}

const getRoadSurfaceType = (surfaceType: string): 'paved' | 'unpaved' => {
  const pavedTypes = ['paved', 'asphalt', 'chipseal', 'concrete', 'paving_stones']
  if (pavedTypes.find((element) => element === surfaceType)) {
    return 'paved'
  }
  return 'unpaved'
}

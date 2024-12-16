import { SegmentWithNodes } from '../../types/roadSegmentTypes'
import { CoordinateObject, FeatureCollection } from '../../types/geoSpatialTypes'
import * as geolib from 'geolib'
import { PlowCoordObject, PlowDataLink } from '../../types/plowDataTypes'
import { logWithTimestamp } from '../logWithTimeStamp'

/**
 * A function to link raw coordinate data from snow plows to RoadSegment objects.
 * @param {SegmentWithNodes[]} roadSegments
 * @param {FeatureCollection} plowData
 * @param {number} distanceLimit
 * @param {number} plowRatio
 * @returns {PlowDataLink[]} An array of objects containing a road segment id and a timestamp of the segments plowing.
 * @author Atte Oksanen
 */
export const linkPlowData = (roadSegments: SegmentWithNodes[], plowData: FeatureCollection, distanceLimit: number, plowRatio: number): PlowDataLink[] => {
  logWithTimestamp('Plow data poller: Started plow data linking')

  const plowCoordMap: Map<number, PlowCoordObject[]> = new Map()
  for (const feature of plowData.features) {
    for (const coordinates of feature.geometry.coordinates as number[][]) {
      const coordObject: PlowCoordObject = {
        longitude: coordinates[0],
        latitude: coordinates[1],
        routeTimeStamp: feature.properties.time
      }
      const localIndex = getIndexByLon(coordObject)
      const tempArray = plowCoordMap.get(localIndex)
      if (!tempArray) {
        plowCoordMap.set(localIndex, [coordObject])
      } else {
        plowCoordMap.set(localIndex, tempArray.concat([coordObject]))
      }
    }
  }

  const mapKeys = Array.from(plowCoordMap.keys())
  const foundLinks: PlowDataLink[] = []
  for (const roadSegment of roadSegments) {
    let segmentLen = 0
    let plowedLen = 0
    const foundTimeStamps: number[] = []
    const indexLimit = Math.floor(roadSegment.nodes.length * (1 - plowRatio))
    for (let i = 0; i < roadSegment.nodes.length - 1; i++) {
      if (i === indexLimit && plowedLen === 0) {
        break
      }
      const lineSegment = [roadSegment.nodes[i], roadSegment.nodes[i + 1]]
      const lineSegmentLen = geolib.getDistance(lineSegment[0], lineSegment[1])
      segmentLen += lineSegmentLen

      const minIndex = Math.min(getIndexByLon(lineSegment[0]), getIndexByLon(lineSegment[1]))
      const maxIndex = Math.max(getIndexByLon(lineSegment[0]), getIndexByLon(lineSegment[1]))
      const indexRange = mapKeys.filter(element => element >= minIndex && element <= maxIndex)
      if (indexRange.length === 0) {
        continue
      }

      const maxDistance = lineSegmentLen / 2
      const centerPoint = geolib.getCenter(lineSegment) as PlowCoordObject
      const maxLatValue = centerPoint.latitude + maxDistance / 111111
      const minLatValue = centerPoint.latitude - maxDistance / 111111
      for (let y = 0, segmentMarked = false; y < indexRange.length && !segmentMarked; y++) {
        const coordBucket = plowCoordMap.get(indexRange[y]) as PlowCoordObject[]
        for (const coordPair of coordBucket.filter(coordElement => coordElement.latitude > minLatValue && coordElement.latitude < maxLatValue)) {
          if (geolib.getDistance(centerPoint, coordPair) > maxDistance) {
            continue
          }
          if (geolib.getDistanceFromLine(coordPair, lineSegment[0], lineSegment[1], 0.1) < distanceLimit) {
            plowedLen += lineSegmentLen
            segmentMarked = true
            foundTimeStamps.push(coordPair.routeTimeStamp as number)
            break
          }
        }
      }
    }
    if (plowedLen / segmentLen > plowRatio) {
      foundLinks.push({ roadSegmentId: roadSegment.id, time: Math.max(...foundTimeStamps) })
    }
  }
  logWithTimestamp(`Plow data poller: Plow data linking finished. Created ${foundLinks.length} plow data links`)
  return foundLinks
}

const getIndexByLon = (coordElement: CoordinateObject) => {
  return Math.floor(coordElement.longitude * 1000)
}

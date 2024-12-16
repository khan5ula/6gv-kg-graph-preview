import { SegmentWithNodes } from '../../types/roadSegmentTypes'
import * as geolib from 'geolib'
import { getLineColor, getTime } from './visualization'
import { Feature, FeatureCollection } from '../../types/geoSpatialTypes'
import { PlowDataGeneratorParams } from '../../types/plowDataTypes'
import { logWithTimestamp } from '../logWithTimeStamp'

/**
 * A function to increase the amount of nodes in RoadSegment objects to better mimic actual plowing data.
 * @param {SegmentWithNodes[]} roadSegments
 * @param {number} plowRatio
 * @returns {SegmentWithNodes[]}
 * @author Atte Oksanen
 */
const increaseDataPoints = (roadSegments: SegmentWithNodes[], plowRatio: number): SegmentWithNodes[] => {
  const firstStepMock: SegmentWithNodes[] = []
  const startIndex = Math.floor(Math.random() * (roadSegments.length - roadSegments.length * plowRatio))
  const endIndex = startIndex + Math.floor(roadSegments.length * plowRatio)
  for (let i = startIndex; i < endIndex; i++) {
    const lineSegments = []
    for (let y = 0; y < roadSegments[i].nodes.length - 1; y++) {
      lineSegments.push([roadSegments[i].nodes[y], roadSegments[i].nodes[y + 1]])
    }
    const updatedSegments: { latitude: number; longitude: number }[] = []
    for (let y = 0; y < lineSegments.length; y++) {
      const centerPoint = geolib.getCenter(lineSegments[y])
      if (!centerPoint) {
        continue
      }
      updatedSegments.push(
        ...[
          lineSegments[y][0],
          {
            ...centerPoint,
            latitude: Math.round(centerPoint.latitude * 1000000) / 1000000,
            longitude: Math.round(centerPoint.longitude * 1000000) / 1000000,
          },
          lineSegments[y][1],
        ]
      )
    }
    firstStepMock.push({ ...roadSegments[i], nodes: updatedSegments })
  }
  return firstStepMock
}

/**
 * Shifts node coordinates within a RoadSegment object
 * @param {SegmentWithNodes[]} roadSegments
 * @param {number} shiftAmount
 * @param {number} shiftProb
 * @returns {SegmentWithNodes[]}
 * @author Atte Oksanen
 */
const shiftDataPoints = (roadSegments: SegmentWithNodes[], shiftAmount: number, shiftProb: number): SegmentWithNodes[] => {
  const shiftFactor = 5000 / shiftAmount
  const secondStepMock: SegmentWithNodes[] = []
  for (let i = 0; i < roadSegments.length; i++) {
    const shiftedCoords = []
    for (let y = 0; y < roadSegments[i].nodes.length - 1; y++) {
      if (Math.random() > shiftProb) {
        shiftedCoords.push(roadSegments[i].nodes[y])
        continue
      }
      const { latitude: localLat, longitude: localLon } = roadSegments[i].nodes[y]
      if (Math.random() > 0.5) {
        shiftedCoords.push({
          latitude: localLat + Math.floor(0.5 - Math.random() * 1000) / 1000 / shiftFactor,
          longitude: localLon,
        })
      } else {
        shiftedCoords.push({
          latitude: localLat,
          longitude: localLon + Math.floor(0.5 - Math.random() * 1000) / 1000 / shiftFactor,
        })
      }
    }
    secondStepMock.push({ ...roadSegments[i], nodes: shiftedCoords })
  }
  return secondStepMock
}

/**
 * An utility function for creating GeoJson from RoadSegment objects
 * @param {SegmentWithNodes[]} roadSegments
 * @param {number} timeWindow
 * @returns {FeatureCollection}
 * @author Atte Oksanen
 */
const roadSegmentToGeoJSON = (roadSegments: SegmentWithNodes[], timeWindow: number): FeatureCollection => {
  const featureCollection: Feature[] = []
  for (let i = 0; i < roadSegments.length; i++) {
    const coords = roadSegments[i].nodes.map((segmentElement) => [segmentElement.longitude, segmentElement.latitude])
    const time = getTime(timeWindow)
    featureCollection.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
      properties: {
        id: roadSegments[i].id,
        time: time,
        stroke: getLineColor(timeWindow, time),
        'stroke-width': 2,
        'stroke-opacity': 1,
      },
    })
  }
  return { type: 'FeatureCollection', features: featureCollection }
}

/**
 * A function for creating mock plow data from the road segments.
 * @param {RoadSegment[]} roadSegments
 * @param {PlowDataGeneratorParams} generatorParams
 * @returns {FeatureCollection}
 * @author Atte Oksanen
 */
export const generatePlowData = (roadSegments: SegmentWithNodes[], generatorParams: PlowDataGeneratorParams): FeatureCollection => {
  logWithTimestamp('Plow data generator: Plow data generation started')
  const sortedSegments = roadSegments.sort((a, b) => (a.centerPoint.latitude < b.centerPoint.latitude ? -1 : 1))
  const firstStepMock = increaseDataPoints(sortedSegments, generatorParams.plowRatio)
  const secondStepMock = shiftDataPoints(firstStepMock, generatorParams.shiftAmount, generatorParams.shiftProb)
  const geoJson = roadSegmentToGeoJSON(secondStepMock, generatorParams.timeWindow)
  logWithTimestamp(`Plow data generator: Returned ${geoJson.features.length} generated plow routes`)
  return geoJson
}

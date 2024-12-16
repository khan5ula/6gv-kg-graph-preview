import * as geolib from 'geolib'
import { WeatherStationLink, WeatherStation } from '../../types/weatherDataTypes'
import { SegmentWithNodes } from '../../types/roadSegmentTypes'
import { CoordinateObject } from '../../types/geoSpatialTypes'
import { logWithTimestamp } from '../logWithTimeStamp'

const DISTANCE_LIMIT = 9

/**
 * A function to link weather station coordinates to the nearest available road segment.
 * @param {WeatherStation[]} weatherStations
 * @param {RoadSegment[]} segmentData
 * @returns {StationLink[]} An array of objects containing weather station ids and the roads they are connected to
 * @author Atte Oksanen
 */
export const linkWeatherStations = (weatherStations: WeatherStation[], segmentData: SegmentWithNodes[]): WeatherStationLink[] => {
  logWithTimestamp('Weather station poller: Weather station linking started')
  const weatherStationsMap = new Map()
  for (let i = 0; i < weatherStations.length; i++) {
    const localIndex = getLocalIndex(weatherStations[i])
    if (weatherStationsMap.has(localIndex)) {
      const tempArray = weatherStationsMap.get(localIndex).concat(weatherStations[i])
      weatherStationsMap.set(localIndex, tempArray)
    } else {
      weatherStationsMap.set(localIndex, [weatherStations[i]])
    }
  }
  const weatherStationLinks: WeatherStationLink[] = []
  const foundWeatherStations = new Set()
  for (let i = 0; i < segmentData.length && foundWeatherStations.size < weatherStations.length; i++) {
    const lineSegments = []
    for (let y = 0; y < segmentData[i].nodes.length - 1; y++) {
      lineSegments.push([segmentData[i].nodes[y], segmentData[i].nodes[y + 1]])
    }
    for (let z = 0, found = false; z < lineSegments.length && !found; z++) {
      const minIndex = Math.min(getLocalIndex(lineSegments[z][0]), getLocalIndex(lineSegments[z][1]))
      const maxIndex = Math.max(getLocalIndex(lineSegments[z][0]), getLocalIndex(lineSegments[z][1]))
      for (let localIndex = minIndex; localIndex <= maxIndex; localIndex++) {
        const coordBucket = weatherStationsMap.get(localIndex)
        if (!coordBucket) {
          continue
        }
        for (let x = 0; x < coordBucket.length; x++) {
          if (foundWeatherStations.has(coordBucket[x].id)) {
            continue
          }
          if (geolib.getDistanceFromLine(coordBucket[x], lineSegments[z][0], lineSegments[z][1], 0.1) < DISTANCE_LIMIT) {
            weatherStationLinks.push({ weatherStationId: coordBucket[x].id, roadSegmentId: segmentData[i].id })
            foundWeatherStations.add(coordBucket[x].id)
            found = true
            break
          }
        }
      }
    }
  }
  logWithTimestamp(`Weather station poller: Weather station linking finished. Created ${weatherStationLinks.length} links`)
  return weatherStationLinks
}

const getLocalIndex = (coordElement: CoordinateObject): number => {
  return Math.floor(coordElement.longitude * 1000)
}

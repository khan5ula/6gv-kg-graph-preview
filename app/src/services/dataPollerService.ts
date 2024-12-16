import { PlowDataGeneratorParams, PlowDataLink } from '../types/plowDataTypes'
import { SegmentWithNodes } from '../types/roadSegmentTypes'
import { WeatherStationLink } from '../types/weatherDataTypes'
import { linkPlowData } from '../utils/data_poller/plowDataLink'
import { linkWeatherStations } from '../utils/data_poller/weatherStationLink'
import { getPlowData } from './data_poller/plowDataService'
import { getForecastData } from './data_poller/fmiForecastService'
import { getWeatherStationLocations } from './data_poller/fmiLocationService'
import { getRoadIndexData } from './data_poller/fmiRoadIndexService'
import { fetchSegmentData } from './data_poller/overpassService'
import { getRoute, getRouteSegments } from './data_poller/routingService'
import { getTrafficAnnouncements } from './data_poller/digitrafficService'

/**
 * A wrapper function for polling weather station locations and linking them to road segments
 * @param {SegmentWithNodes[]} roadSegments 
 * @param {string} apiUrl URL to FMI road index database
 * @returns {Promise<WeatherStationLink[]>} Array of objects containing links between road segments and weather stations. If an exception occurs, the array will be returned empty
 * @author Atte Oksanen
 */
const getStationLinks = async (roadSegments: SegmentWithNodes[], apiUrl: string): Promise<WeatherStationLink[]> => {
  return linkWeatherStations(await getWeatherStationLocations(apiUrl), roadSegments)
}

/**
 * A wrapper function for polling plow data and linking it to the road segments
 * @async
 * @param {SegmentWithNodes[]} roadSegments 
 * @param {number} distanceLimit 
 * @param {number} plowRatio 
 * @returns {Promise<PlowDataLink[]>} An array of objects containing a road segment id and a timestamp of the segments plowing. If data cannot be polled or generated, the array will be returned empty.
 * Returned data under ODbl-1.0 license https://opendatacommons.org/licenses/odbl/
 * @author Atte Oksanen
 */
const getPlowDataLinks = async (roadSegments: SegmentWithNodes[], distanceLimit: number, plowRatio: number, generateMockData: boolean, generatorParams?: PlowDataGeneratorParams): Promise<PlowDataLink[]> => {
  return linkPlowData(roadSegments, await getPlowData(roadSegments, generateMockData, generatorParams), distanceLimit, plowRatio)
}

/**
 * A wrapper object to ease the use of data polling functions
 * @author Atte Oksanen
 */
export const dataPoller = {
  getSegments: fetchSegmentData,
  getStationLinks: getStationLinks,
  getRoadIndex: getRoadIndexData,
  getForecast: getForecastData,
  getPlowDataLinks: getPlowDataLinks,
  getRoute: getRoute,
  getRouteSegments: getRouteSegments,
  getTrafficAnnouncements: getTrafficAnnouncements
}

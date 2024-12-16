import axios from 'axios'
import { generatePlowData } from '../../utils/data_poller/plowDataGenerator'
import { SegmentWithNodes } from '../../types/roadSegmentTypes'
import { Feature, FeatureCollection } from '../../types/geoSpatialTypes'
import { getLineColor } from '../../utils/data_poller/visualization'
import { MaintenanceRoute, MaintenanceRouteEvents, PlowDataGeneratorParams } from '../../types/plowDataTypes'
import { GraphQLResponse } from 'graphql-request/build/esm/types'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'

const API_URL = 'https://api.oulunliikenne.fi/proxy/graphql'
const query = {
  query: `
query GetMaintenanceVehicleRouteEvents {
     maintenanceVehicleRouteEvents(routeType:MOTORISED) {
       id
       routeEventId
       routeType
       measuredTime
       contractId
       jobIds
       geometryId
       geojson
     }
 }
 `,
}

/**
 * A function for polling snow plow data. Includes a mock data generator failsafe for API-failure
 * @async
 * @param {SegmentWithNodes[]} roadSegments
 * @param {PlowDataGeneratorParams} generatorParams optional parameters for plow data generation
 * @returns {Promise<FeatureCollection>} A Feature collection that contains either real data or generated mock data. If data cannot be polled or generated, the Feature Collection will be returned empty
 * @author Atte Oksanen
 */
export const getPlowData = async (roadSegments: SegmentWithNodes[], generateMockData: boolean, generatorParams?: PlowDataGeneratorParams): Promise<FeatureCollection> => {
  logWithTimestamp('Plow data poller: Started plow data fetching')
  try {
    const returnData: GraphQLResponse<MaintenanceRouteEvents> = (await axios.post(API_URL, query)).data
    if (!returnData.data) {
      throw new Error('API returned no data')
    }
    if (returnData.data.maintenanceVehicleRouteEvents.length < 1) {
      throw new Error('No plow routes returned')
    }
    const plowRoutes: MaintenanceRoute[] = returnData.data.maintenanceVehicleRouteEvents.sort((a, b) => (Date.parse(a.measuredTime) <= Date.parse(b.measuredTime) ? 1 : -1))
    const timeWindow = Math.floor(
      (Math.max(...plowRoutes.map((element) => Date.parse(element.measuredTime))) - Math.min(...plowRoutes.map((element) => Date.parse(element.measuredTime)))) / 3600000
    )
    const features: Feature[] = []
    const usedIds: Set<string> = new Set()
    for (let i = 0; i < plowRoutes.length; i++) {
      if (usedIds.has(plowRoutes[i].geometryId)) {
        continue
      }
      usedIds.add(plowRoutes[i].geometryId)
      const time = Date.parse(plowRoutes[i].measuredTime)
      const updatedGeoJson = {
        ...plowRoutes[i].geojson,
        properties: {
          id: plowRoutes[i].geojson.properties.id,
          time: time,
          stroke: getLineColor(timeWindow, time),
          'stroke-width': 2,
          'stroke-opacity': 1,
        },
      }
      features.push(updatedGeoJson)
    }
    logWithTimestamp(`Plow data poller: Returned ${features.length} plow routes`)
    return { type: 'FeatureCollection', features: features }
  } catch (error) {
    if (!generateMockData) {
      errorWithTimeStamp('Plow data poller: Mock data generation not allowed, plow data not included in data set.')
      return { type: 'FeatureCollection', features: [] }
    }
    if (!generatorParams || !roadSegments) {
      errorWithTimeStamp('Plow data poller: No generator parameters provided, plow data not included in data set.')
      return { type: 'FeatureCollection', features: [] }
    }

    logWithTimestamp('Plow data poller: API failed, switching to mock data generation.')
    return generatePlowData(roadSegments, generatorParams)
  }
}

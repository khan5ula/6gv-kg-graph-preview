import { Feature } from './geoSpatialTypes'

export interface MaintenanceRouteEvents {
  maintenanceVehicleRouteEvents: MaintenanceRoute[]
}

export interface MaintenanceRoute {
  id: string
  routeEventId: string
  routeType: string
  measuredTime: string
  contractId: number
  jobIds: number[]
  geometryId: string
  geojson: Feature
}

export interface PlowCoordObject {
  latitude: number
  longitude: number
  routeTimeStamp?: number | string
}

export interface PlowDataLink {
  roadSegmentId: number
  time: number
}

export interface PlowDataGeneratorParams {
  plowRatio: number
  shiftAmount: number
  shiftProb: number
  timeWindow: number
}

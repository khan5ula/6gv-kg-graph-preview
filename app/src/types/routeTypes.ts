import { LatLonTuple } from './geoSpatialTypes'

export interface RouteApiReturnObject {
  code: 'Ok'
  routes: RouteElement[]
  tracepoints: TracePointElement[]
}

interface RouteElement {
  confidence: number
  geometry: string
  legs: RouteLegElement[]
}

export interface RouteLegElement {
  steps: string[]
  summary: string | undefined
  weight: number
  duration: number
  distance: number
  annotation: {
    nodes: number[]
  }
}

interface TracePointElement {
  waypoint_index: number
  matchings_index: number
  alternatives_count: number
  hint: string
  distance: number
  name: string
  location: LatLonTuple
}

export interface RouteWithRoadSegments {
  legs: RouteLeg[]
}

export interface RouteLeg {
  leg: number
  roadSegmentIds: number[]
}

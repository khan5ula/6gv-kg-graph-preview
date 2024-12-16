import { CoordinateObject } from './geoSpatialTypes'

export interface OverpassReturnObject {
  version: number
  generator: string
  osm3s: {
    timestamp_osm_base: string
    copyright: string
  }
  elements: OverpassElement[]
}

interface OverpassElement {
  type: 'way' | 'node' | 'relation'
  id: number
  bounds: {
    minlat: number
    minlon: number
    maxlat: number
    maxlon: number
  }
  nodes: number[]
  geometry: { lat: number; lon: number }[]
  tags: {
    highway: RoadType
    maxspeed: string
    motor_vehicle: string
    name: string
    'name:fi': string
    'name:sv': string
    oneway: string
    surface: 'paved' | 'asphalt' | 'chipseal' | 'concrete' | 'paving_stones' | 'unpaved' | 'compacted' | 'fine_gravel' | 'gravel' | 'ground' | 'dirt' | 'sand'
  }
}

export type SpeedLimit = 20 | 30 | 40 | 50 | 60 | 70 | 80 | 100

export type Surface = 'unpaved' | 'paved'

export type RoadType = 'unclassified' | 'trunk' | 'motorway' | 'primary' | 'secondary' | 'tertiary' | 'residential'

export interface RoadSegmentTags {
  highway: RoadType
  maxspeed: SpeedLimit
  surface: Surface
}

export interface RoadSegment {
  id: number
  centerPoint: CoordinateObject
  tags: {
    highway: RoadType
    maxspeed: SpeedLimit
    surface?: Surface
  }
}

export interface SegmentWithNodes extends RoadSegment {
  nodes: CoordinateObject[]
}

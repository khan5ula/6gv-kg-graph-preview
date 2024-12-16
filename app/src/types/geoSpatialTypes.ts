export interface CoordinateObject {
  latitude: number
  longitude: number
  id?: number
}

export interface Feature {
  type: 'Feature'
  geometry: {
    type: string
    coordinates: number[][] | number[]
  }
  properties: {
    id: number
    time?: number
    stroke?: string
    'stroke-width'?: number
    'stroke-opacity'?: number
  }
}

export interface FeatureCollection {
  type: 'FeatureCollection'
  features: Feature[]
}

export type LatLonTuple = [number, number]

export type BoundingBox = [LatLonTuple, LatLonTuple]

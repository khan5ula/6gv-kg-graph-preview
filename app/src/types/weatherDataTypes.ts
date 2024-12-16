export interface WeatherStation {
  id: number
  latitude: number
  longitude: number
}

export interface WeatherStationLink {
  weatherStationId: number
  roadSegmentId: number
}

export type StationData = {
  time: string[]
  Temperature: string[]
  DewPoint: string[]
  RoadTemperature: string[]
  RoadCondition: string[]
  RoadConditionSeverity: string[]
  RoadSnowCover: string[]
  RoadWaterCover: string[]
  RoadIceCover: string[]
  RoadFrostCover: string[]
  Friction: string[]
  lat: number
  lon: number
}

export interface WeatherStationWrapper {
  [key: string]: StationData
}

export interface WeatherStationData {
  id: number
  forecasts: StationForecast[]
}

export interface StationForecast {
  time: number
  temperature: number
  dewPoint: number
  roadTemperature: number
  roadCondition: number
  roadConditionSeverity: number
  roadSnowCover: number
  roadWaterCover: number
  roadIceCover: number
  roadFrostCover: number
  friction: number
}

export interface ForecastLink {
  roadSegmentId: number
  forecasts: PointForecast[]
}

export interface PointForecast {
  time: number
  temperature: number
  precipitation: number
  precipitationPerHour: number
  precipitationType: 'rain' | 'sleet' | 'snow'
  windSpeed: number
  windDirection: number
}

export type RoadCondition = 'not known' | 'dry road' | 'damp' | 'wet' | 'wet snow' | 'deposit (black ice)' | 'partly icy' | 'icy' | 'dry snow'

export type RoadConditionSeverity = 'not known' | 'normal' | 'difficult' | 'very difficult'

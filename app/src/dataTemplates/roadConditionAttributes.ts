import { RoadCondition, RoadConditionSeverity } from '../types/weatherDataTypes'

const roadConditionDescriptions: { [key: number]: RoadCondition } = {
  0: 'not known',
  1: 'dry road',
  2: 'damp',
  3: 'wet',
  4: 'wet snow',
  5: 'deposit (black ice)',
  6: 'partly icy',
  7: 'icy',
  8: 'dry snow',
}

export const getRoadCondition = (key: number): RoadCondition => {
  return roadConditionDescriptions[key]
}

export const getAllRoadConditions = (): RoadCondition[] => {
  return Object.values(roadConditionDescriptions)
}

const roadConditionSeverityDescriptions: { [key: number]: RoadConditionSeverity } = {
  0: 'not known',
  1: 'normal',
  2: 'difficult',
  3: 'very difficult',
}

export const getRoadConditionSeverity = (key: number): RoadConditionSeverity => {
  return roadConditionSeverityDescriptions[key]
}

export const getAllRoadConditionSeverities = (): RoadConditionSeverity[] => {
  return Object.values(roadConditionSeverityDescriptions)
}

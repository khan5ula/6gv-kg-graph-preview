import { getPlowData } from '../../src/services/data_poller/plowDataService'
import { fetchSegmentData } from '../../src/services/data_poller/overpassService'
import { BoundingBox } from '../../src/types/geoSpatialTypes'

test('plow data should have correct structure', async () => {
  const boundingBox: BoundingBox = [
    [64.7, 25.2486],
    [65.1968, 25.9491],
  ]
  const generatorParams = { plowRatio: 0.15, shiftAmount: 0.2, shiftProb: 0.5, timeWindow: 36 }
  const roadSegments = await fetchSegmentData(boundingBox)
  const plowData = await getPlowData(roadSegments, false, generatorParams)
  expect(plowData.type).toBe('FeatureCollection')
  expect(plowData.features.length).toBeGreaterThan(0)
  expect(plowData.features[0].geometry.type).toBeDefined()
  expect(plowData.features[0].geometry.coordinates).toBeDefined()
  expect(plowData.features[0].properties).toBeDefined()
  expect(plowData.features[0].properties.id).toBeDefined()
})

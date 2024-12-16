import { test } from '@jest/globals'
import { fetchSegmentData } from '../../src/services/data_poller/overpassService'
import { BoundingBox } from '../../src/types/geoSpatialTypes'

test('should use the correct structure with data from Overpass API', async () => {
  const boundingBox: BoundingBox = [
    [64.7, 25.2486],
    [65.1968, 25.9491],
  ]
  const segments = await fetchSegmentData(boundingBox)
  expect(segments[0].id).toBeDefined()
  expect(segments[0].nodes.length).toBeGreaterThan(0)
  expect(segments[0].centerPoint).toBeDefined()
  expect(segments[0].centerPoint.longitude).toBeDefined()
  expect(segments[0].centerPoint.latitude).toBeDefined()
  expect(segments[0].tags.highway).toBeDefined()
  expect(segments[0].tags.highway).toMatch(/unclassified|trunk|motorway|primary|secondary|tertiary|residential/)
  expect(segments[0].tags.maxspeed).toBeDefined()
  expect(segments[0].tags.surface).toBeDefined()
  expect(segments[0].tags.surface).toMatch(/paved|unpaved/)
})

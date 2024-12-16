import { getForecastData } from '../../../src/services/data_poller/fmiForecastService'
import { RoadSegment } from '../../../src/types/roadSegmentTypes'
import mockRoadSegmentsData from '../../mock_data/roadSegment.json'

describe('fmiForecastService', () => {
  test('should return forecast data', async () => {
    const dataRatio = 0.05
    const mockRoadSegments = mockRoadSegmentsData as RoadSegment[]

    const result = await getForecastData(mockRoadSegments, dataRatio)
    expect(result).toBeDefined()
  })
})

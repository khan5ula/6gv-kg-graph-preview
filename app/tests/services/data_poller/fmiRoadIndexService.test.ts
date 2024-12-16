import axios from 'axios'
import { getRoadIndexData } from '../../../src/services/data_poller/fmiRoadIndexService'

jest.mock('axios')

describe('getRoadIndexData', () => {
  it('fetches road index data successfully', async () => {
    ;(axios.get as jest.Mock).mockResolvedValueOnce({ data: '<Key>test-key</Key>' }).mockResolvedValueOnce({
      data: {
        '123': {
          time: 202201010000,
          temperature: 0,
          dewPoint: 0,
          roadTemperature: 2,
          roadCondition: 3,
          roadConditionSeverity: 2,
          roadSnowCover: 4.5,
          roadWaterCover: 1,
          roadIceCover: 3,
          roadFrostCover: 2,
          friction: 0.5,
        },
        '456': {
          time: 202201010000,
          Temperature: 5,
          DewPoint: 3,
          RoadTemperature: 5,
          RoadCondition: 3,
          RoadConditionSeverity: 1,
          RoadSnowCover: 2,
          RoadWaterCover: 5,
          RoadIceCover: 3,
          RoadFrostCover: 2,
          Friction: 4,
        },
      },
    })

    const result = await getRoadIndexData('https://fake.url')

    expect(result).toEqual([
      {
        forecasts: [],
        id: 123,
      },
      {
        forecasts: [],
        id: 456,
      },
    ])
  })
})

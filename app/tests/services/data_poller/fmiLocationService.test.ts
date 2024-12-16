import axios from 'axios'
import { getWeatherStationLocations } from '../../../src/services/data_poller/fmiLocationService'

jest.mock('axios')

describe('Service: fmiLocationService', () => {
  test('should return a list of locations', async () => {
    ;(axios.get as jest.Mock).mockResolvedValueOnce({
      data: '<Key>mockFileName</Key>',
    })
    ;(axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        '1': { lat: 60.0, lon: 25.0 },
        '2': { lat: 60.1, lon: 25.1 },
      },
    })

    const result = await getWeatherStationLocations('https://fake.url')

    expect(result).toBeDefined()
    expect(result.length).toBe(2)
  })
})

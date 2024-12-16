import axios from 'axios'
import { StationForecast, WeatherStationData, WeatherStationWrapper } from '../../types/weatherDataTypes'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'

/**
 * A function to fetch road index data from FMI
 * @async
 * @param {string} apiUrl URL to FMI road index database
 * @returns {Promise<WeatherStationData[]>} An array of weather station objects. If an exception occurs, it will return an empty array
 * @author Atte Oksanen
 */
export const getRoadIndexData = async (apiUrl: string): Promise<WeatherStationData[]> => {
  logWithTimestamp(`Road index data poller: Road index data fetching started`)
  try {
    const directoryString: string = (await axios.get(apiUrl)).data
    const fileName = directoryString.substring(directoryString.indexOf('<Key>') + 5, directoryString.indexOf('</Key>'))
    const weatherStationData: WeatherStationWrapper = (await axios.get(`${apiUrl}/${fileName}`)).data
    const stationIds = Object.keys(weatherStationData)
    const returnArray: WeatherStationData[] = []
    let forecastCount = 0
    for (let i = 0; i < stationIds.length; i++) {
      const station = weatherStationData[stationIds[i]]
      const stationForecasts: StationForecast[] = []
      forecastCount += station.time.length
      for (let y = 0; y < station.time.length; y++) {
        stationForecasts.push({
          time: Date.parse(
            `${station.time[y].slice(0, 4)}-${station.time[y].slice(4, 6)}-${station.time[y].slice(6, 8)}T${station.time[y].slice(8, 10)}:${station.time[y].slice(10, 12)}`
          ),
          temperature: Number(station.Temperature[y]),
          dewPoint: Number(station.DewPoint[y]),
          roadTemperature: Number(station.RoadTemperature[y]),
          roadCondition: Number(station.RoadCondition[y]),
          roadConditionSeverity: Number(station.RoadConditionSeverity[y]),
          roadSnowCover: Number(station.RoadSnowCover[y]),
          roadWaterCover: Number(station.RoadWaterCover[y]),
          roadIceCover: Number(station.RoadIceCover[y]),
          roadFrostCover: Number(station.RoadFrostCover[y]),
          friction: Number(station.Friction[y]),
        })
      }
      returnArray.push({ id: Number(stationIds[i]), forecasts: stationForecasts })
    }
    logWithTimestamp(`Road index data poller: Returned ${forecastCount} road index forecasts`)
    return returnArray
  } catch (error) {
    errorWithTimeStamp('Bad request to FMI API, no road index data returned')
    return []
  }
}

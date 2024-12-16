import { WeatherStation, WeatherStationWrapper } from '../../types/weatherDataTypes'
import axios from 'axios'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'

/**
 * Function for polling the locations of FMI road weather stations
 * @async
 * @param {string} apiUrl URL address to the FMI road index database
 * @returns {Promise<WeatherStation[]>} An array of weather stations. If the function faces an exception, it will return an empty array
 * @author Atte Oksanen
 */
export const getWeatherStationLocations = async (apiUrl: string): Promise<WeatherStation[]> => {
  logWithTimestamp('Weather station poller: Weather station location fetching started')
  try {
    const directoryString: string = (await axios.get(apiUrl)).data
    const fileName = directoryString.substring(directoryString.indexOf('<Key>') + 5, directoryString.indexOf('</Key>'))
    const weatherData: WeatherStationWrapper = (await axios.get(`${apiUrl}/${fileName}`)).data
    const weatherStationIds = Object.keys(weatherData)
    const weatherStations: WeatherStation[] = []
    for (let i = 0; i < weatherStationIds.length; i++) {
      const weatherStationInfo: WeatherStation = {
        id: parseInt(weatherStationIds[i]),
        latitude: weatherData[weatherStationIds[i]].lat,
        longitude: weatherData[weatherStationIds[i]].lon,
      }
      weatherStations.push(weatherStationInfo)
    }
    logWithTimestamp(`Weather station poller: ${weatherStations.length} weather stations found`)
    return weatherStations
  } catch (error) {
    errorWithTimeStamp('Bad request to FMI API, no weather station locations returned')
    return []
  }
}

import { RoadSegment } from '../../types/roadSegmentTypes'
import { CoordinateObject } from '../../types/geoSpatialTypes'
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { ForecastLink, PointForecast } from '../../types/weatherDataTypes'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'

const xmlParser = new XMLParser()
const API_URL = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=ecmwf::forecast::surface::point::multipointcoverage&latlon='

/**
 * A function to query open forecast data from FMI
 * @async
 * @param {RoadSegment[]} roadSegments
 * @param {number} dataRatio parameter for tuning how much data will be polled
 * @returns {Promise<ForecastLink[]>} An array of links between forecast data and road segments. If an exception occurs, the array will be returned empty. Returned data under CC BY 4.0 license https://creativecommons.org/licenses/by/4.0/
 * @author Atte Oksanen
 */
export const getForecastData = async (roadSegments: RoadSegment[], dataRatio: number): Promise<ForecastLink[]> => {
  logWithTimestamp(`Point forecast data poller: Point forecast data fetching started`)
  try {
    const forecastLinks: ForecastLink[] = []
    const skipAmount = 1 / dataRatio
    const segmentsForPolling = roadSegments.filter((element, index) => index % skipAmount === 0).sort((a, b) => (a.centerPoint.latitude < b.centerPoint.latitude ? -1 : 1))
    let forecastCount = 0
    const apiResponse = await Promise.all(segmentsForPolling.map(segment => axios.get(getQuery(segment.centerPoint))))

    for (let i = 0; i < apiResponse.length; i++) {
      const wfsJson = xmlParser.parse(apiResponse[i].data)

      const weatherElementStringArray: string[] =
        wfsJson['wfs:FeatureCollection']['wfs:member']['omso:GridSeriesObservation']['om:result']['gmlcov:MultiPointCoverage']['gml:rangeSet']['gml:DataBlock'][
          'gml:doubleOrNilReasonTupleList'
        ].split('\n')

      const weatherElements: number[][] = weatherElementStringArray.map((fullStringElement) =>
        fullStringElement
          .trim()
          .split(' ')
          .filter((stringElement) => stringElement !== '')
          .map((element) => Number(element))
      )

      const wfsPositions: string[] =
        wfsJson['wfs:FeatureCollection']['wfs:member']['omso:GridSeriesObservation']['om:result']['gmlcov:MultiPointCoverage']['gml:domainSet']['gmlcov:SimpleMultiPoint'][
          'gmlcov:positions'
        ].split('\n')

      const timeStamps: number[] = wfsPositions
        .map((fullStringElement) =>
          fullStringElement
            .trim()
            .split(' ')
            .filter((stringElement) => stringElement !== '')
            .map((element) => Number(element))
        )
        .map((tripleElement) => {
          return tripleElement[2]
        })

      const forecasts: PointForecast[] = []
      for (let y = 0; y < timeStamps.length; y++) {
        const precipitationType = weatherElements[y][1] < 0.2 ? (weatherElements[y][1] < -0.2 ? 'snow' : 'sleet') : 'rain'
        const windSpeed = Number(Math.sqrt(Math.pow(weatherElements[y][6], 2) + Math.pow(weatherElements[y][7], 2)).toFixed(2))
        const windDirection = Number(((Math.atan2(weatherElements[y][6], weatherElements[y][7]) * 180) / Math.PI).toFixed(2))
        forecasts.push({
          time: timeStamps[y] * 1000,
          temperature: weatherElements[y][1],
          precipitation: isNaN(weatherElements[y][17]) ? 0 : weatherElements[y][17],
          precipitationPerHour: weatherElements[y][16],
          precipitationType: precipitationType,
          windSpeed: windSpeed,
          windDirection: windDirection < 0 ? windDirection + 180 : windDirection,
        })
      }
      forecastCount += forecasts.length
      forecastLinks.push({ roadSegmentId: segmentsForPolling[i].id, forecasts: forecasts })
    }
    logWithTimestamp(`Point forecast data poller: Returned ${forecastCount} point forecasts`)
    return forecastLinks
  } catch (error) {
    errorWithTimeStamp('FMI forecast API failed, no point forecasts returned')
    return []
  }
}

const getQuery = (roadSegmentCoords: CoordinateObject): string => {
  return `${API_URL}${roadSegmentCoords.latitude},${roadSegmentCoords.longitude}`
}

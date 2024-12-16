import neo4j, { Driver, Session } from 'neo4j-driver'
import { getRoadCondition, getRoadConditionSeverity } from '../../dataTemplates/roadConditionAttributes'
import { WeatherStationData, WeatherStationLink } from '../../types/weatherDataTypes'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'
import { queryGenerator } from '../../utils/neo4j/queryGenerator'

/**
 * Function that receives an array of FMI road weather station data links,
 * creates WeatherStation nodes based on their ID's and links them to the
 * corresponding RoadSegment nodes.
 * @param weatherstationLinks WeatherStationLink[]: An array of WeatherStation
 * links containing the ID's of the RoadSegment and WeatherStation nodes
 * to be linked to each other.
 * @param neodriver Driver: An instance of the Neo4J driver used to
 * connect to and interact with the Neo4J knowledge graph.
 * @returns Promise<void>: The function returns a promise.
 * If an error occurs during the process, the promise will
 * reject with the encountered error.
 * @author Kristian Hannula
 */
export const handleWeatherStationLinks = async (weatherstationLinks: WeatherStationLink[], neodriver: Driver): Promise<void> => {
  const session: Session = neodriver.session()

  logWithTimestamp(`Neo4J Service: Linking WeatherStation nodes to RoadSegment nodes`)

  try {
    for (const link of weatherstationLinks) {
      await session.run(
        `
            MATCH (rs:RoadSegment {segmentId: $segmentId})
            MERGE (ws: WeatherStation {weatherStationId: $weatherStationId})
            SET ws.alias = "WeatherStation"
            MERGE (rs)-[:HAS_ROADWEATHER_STATION]->(ws)
          `,
        { segmentId: link.roadSegmentId, weatherStationId: link.weatherStationId }
      )
    }
    logWithTimestamp(`Neo4J Service: Weather stations were successfully linked to road segments`)
  } catch (error) {
    logWithTimestamp(`Neo4J Service: Error processing Weather Station Link data: ${error}`)
    throw error
  } finally {
    await session.close()
  }
}

/**
 * Function that receives an array of Weather Station Data objects,
 * creates Forecast nodes based on the data and links the Forecast nodes
 * with the corresponding WeatherStation nodes.
 * @param weatherStationData WeatherStationData[]: An array of WeatherStationData
 * objects containing the information of weather station ID's and
 * the forecasts that belong to each weather station.
 * @param neodriver Driver: An instance of the Neo4J driver used to
 * connect to and interact with the Neo4J knowledge graph.
 * @returns Promise<void>: The function returns a promise.
 * If an error occurs during the process, the promise will
 * reject with the encountered error.
 * @author Kristian Hannula
 */
export const handleRoadIndexForecasts = async (weatherStationData: WeatherStationData[], neodriver: Driver): Promise<void> => {
  const session: Session = neodriver.session()

  /* remove existing forecasts. 
  In the future this could be removed if historical road index data is needed.
  */
  await session.run(queryGenerator.simpleDelete('StationForecast'))

  logWithTimestamp(`Neo4J Service: Linking StationForecast nodes to WeatherStation nodes`)

  try {
    for (const entry of weatherStationData) {
      for (const forecast of entry.forecasts) {
        await session.run(
          `
            MERGE (fc: StationForecast {
              time: datetime({epochMillis: $time}),
              temperature: $temperature,
              roadTemperature: $roadTemperature,
              roadCondition: $roadCondition,
              roadConditionSeverity: $roadConditionSeverity
            })
            WITH fc
            MATCH (ws: WeatherStation {weatherStationId: $weatherStationId})
            SET fc.alias = "StationForecast"
            MERGE (ws)-[:HAS_STATION_FORECAST]->(fc)
          `,
          {
            weatherStationId: entry.id,
            time: neo4j.int(forecast.time),
            temperature: forecast.temperature,
            roadTemperature: forecast.roadTemperature,
            roadCondition: getRoadCondition(forecast.roadCondition),
            roadConditionSeverity: getRoadConditionSeverity(forecast.roadConditionSeverity),
          }
        )
      }
    }
    logWithTimestamp(`Neo4J Service: Station Forecast data successfully migrated to Neo4J`)
  } catch (error) {
    errorWithTimeStamp(`Neo4J Service: Error processing Road Weather Index Forecast data: ${error}`)
    throw error
  } finally {
    await session.close()
  }
}

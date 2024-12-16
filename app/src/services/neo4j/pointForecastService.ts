import neo4j, { Driver, Session } from 'neo4j-driver'
import { ForecastLink } from '../../types/weatherDataTypes'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'
import { queryGenerator } from '../../utils/neo4j/queryGenerator'

/**
 * Function that receives an array of Point Forecast links
 * and connects them to the corresponding RoadSegment nodes.
 * @param links ForecastLink[]: Link objects that contain the information
 * of which forecasts belong to which road segments.
 * @param neodriver Driver: Neo4J Driver
 * @author Kristian Hannula
 */
export const handlePointForecasts = async (links: ForecastLink[], neodriver: Driver): Promise<void> => {
  logWithTimestamp(`Neo4J Service: Linking point forecasts to RoadSegment nodes`)

  if (links.length < 1) {
    logWithTimestamp(`Neo4J Service: No point forecasts received`)
    return
  }

  const forecastsData = links.flatMap((link) =>
    link.forecasts.map((forecast) => ({
      ...forecast,
      segmentId: link.roadSegmentId,
      time: neo4j.int(forecast.time)
    }))
  )

  const session: Session = neodriver.session()

  // remove existing forecasts
  await session.run(queryGenerator.simpleDelete('PointForecast'))

  try {
    await session.run(queryGenerator.linkPointForecasts(), { forecastsData })
    logWithTimestamp(`Neo4J Service: Point forecasts successfully processed`)
  } catch (error) {
    errorWithTimeStamp(`Neo4J Service: Error processing point forecasts: ${error}`)
    throw error
  } finally {
    await session.close()
  }
}

import { handlePlowLinks } from './neo4j/plowService'
import { handleRoadSegments } from './neo4j/roadSegmentService'
import { handleRoadIndexForecasts, handleWeatherStationLinks } from './neo4j/fmiRoadIndexService'
import { handlePointForecasts } from './neo4j/pointForecastService'
import { connectServerToNeo4J } from './neo4j/connectionService'
import { handleAnnouncements } from './neo4j/announcementService'

/**
 * A wrapper object to ease the use of neo4j service functions
 * @author Kristian Hannula
 */
export const neo4jService = {
  populateWithRoadSegments: handleRoadSegments,
  linkSegmentsWithPlowData: handlePlowLinks,
  linkSegmentsWithWeatherStations: handleWeatherStationLinks,
  populateWithRoadIndexData: handleRoadIndexForecasts,
  linkSegmentsWithPointForecasts: handlePointForecasts,
  connect: connectServerToNeo4J,
  linkAnnouncements: handleAnnouncements,
}

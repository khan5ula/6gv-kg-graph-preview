import { Driver } from 'neo4j-driver'
import { dataPoller } from '../../services/dataPollerService'
import { neo4jService } from '../../services/neo4jService'
import { SegmentWithNodes } from '../../types/roadSegmentTypes'
import { PlowDataLink } from '../../types/plowDataTypes'
import { CronJob } from 'cron'
import { errorWithTimeStamp } from '../../utils/logWithTimeStamp'
import { CronTimes } from '../../types/timingTypes'

/**
 * Function that calls DataPoller and Neo4J service functions
 * for handling FMI Road Index Forecast data.
 * @param neodriver: Driver Neo4J Driver
 * @param s3url: string URL for the S3 Bucket. Must be defined as ENV.
 */
const runRoadIndexServices = async (neodriver: Driver, s3Url: string) => {
  const roadIndexData = await dataPoller.getRoadIndex(s3Url)
  await neo4jService.populateWithRoadIndexData(roadIndexData, neodriver)
}
/**
 * Function that calls DataPoller and Neo4J service functions
 * for handling traffic announcement data.
 * @param neodriver: Driver Neo4J Driver
 * @param digiTrafficUrl: string URL for the digitraffic API. Must be defined as ENV.
 */
const runAnnouncementServices = async (neodriver: Driver, digiTrafficUrl: string) => {
  const announcementData = await dataPoller.getTrafficAnnouncements(digiTrafficUrl)
  await neo4jService.linkAnnouncements(announcementData, neodriver)
}


/**
 * Function that calls DataPoller and Neo4J service functions
 * for handling coordinate point based open access Forecast data.
 * @param roadSegments SegmentWithNodes[]: Road segments returned
 * by the DataPoller
 * @param neodriver: Driver Neo4J Driver
 */
const runPointForecastServices = async (roadSegments: SegmentWithNodes[], neodriver: Driver) => {
  const forecasts = await dataPoller.getForecast(roadSegments, 0.05)
  await neo4jService.linkSegmentsWithPointForecasts(forecasts, neodriver)
}

/**
 * Function that calls DataPoller and Neo4J service functions
 * for handling plowing data.
 * @param roadSegments SegmentWithNodes[]: Road segments returned
 * by the DataPoller
 * @param neodriver Driver Neo4J Driver
 */
const runPlowDataServices = async (roadSegments: SegmentWithNodes[], generateMockData: boolean, neodriver: Driver) => {
  const plowData: PlowDataLink[] = await dataPoller.getPlowDataLinks(roadSegments, 6, 0.4, generateMockData, { plowRatio: 0.15, shiftAmount: 0.2, shiftProb: 0.5, timeWindow: 36 })
  await neo4jService.linkSegmentsWithPlowData(plowData, neodriver)
}

/**
 * Function that calls DataPoller and Neo4J service functions
 * for handling Weather Station links.
 * @param roadSegments SegmentWithNodes[]: Road segments returned
 * by the DataPoller
 * @param neodriver Driver Neo4J Driver
 */
const runStationWeatherServices = async (roadSegments: SegmentWithNodes[], s3Url: string, neodriver: Driver) => {
  const weatherStationLinks = await dataPoller.getStationLinks(roadSegments, s3Url)
  await neo4jService.linkSegmentsWithWeatherStations(weatherStationLinks, neodriver)
}

/**
 * Function that runs a sequence of all DataPoller & Neo4J Service function pairs.
 * Should be called when the server starts.
 * @param roadSegments SegmentWithNodes[]: Road segments returned
 * by the DataPoller
 * @param neodriver Driver Neo4J Driver
 * @param s3Url string: URL for the S3 Bucket. Must be defined as ENV.
 * @param digiTrafficUrl string: URL for the digitraffic API. Must be defined as ENV.
 */
export const runAll = async (roadSegments: SegmentWithNodes[], generateMockData: boolean, neodriver: Driver, s3Url: string, digiTrafficUrl: string) => {
  /*const roadSegmentObjects: RoadSegment[] = roadSegments.map((element) => {
    return { ...element, nodes: undefined }
  })*/

  await neo4jService.populateWithRoadSegments(roadSegments, neodriver)
  await runStationWeatherServices(roadSegments, s3Url, neodriver)
  await runPlowDataServices(roadSegments, generateMockData, neodriver)
  await runRoadIndexServices(neodriver, s3Url)
  await runPointForecastServices(roadSegments, neodriver)
  await runAnnouncementServices( neodriver, digiTrafficUrl)
}

/**
 * Function that calls the DataPoller & Neo4J Service function pairs
 * based on the timing defined in CRON syntax.
 * eg. Every day, at 10:00, at system timezone.
 * @param roadSegments SegmentWithNodes[]: Road segments returned
 * by the DataPoller
 * @param neodriver Driver: Neo4J Driver
 * @param s3Url string: URL for the S3 bucket. Must be defined as ENV.
 * @param digiTrafficUrl string: URL for the digitraffic API. Must be defined as ENV.
 * @param cronTimes CronTimes: The CRON time schedules to be used in the scheduled jobs.
 * The function checks whether the jobs are marked as valid or not. If they are not, fallback
 * schedules are used instead.
 */
export const setCronJobs = (roadSegments: SegmentWithNodes[], generateMockData: boolean, neodriver: Driver, s3Url: string,digiTrafficUrl: string, cronTimes: CronTimes) => {
  try {
    new CronJob(cronTimes.roadIndex.valid ? cronTimes.roadIndex.cron : '0 */3 * * *', () => runRoadIndexServices(neodriver, s3Url), null, true, 'system')
    new CronJob(cronTimes.plow.valid ? cronTimes.plow.cron : '0 */3 * * *', () => runPlowDataServices(roadSegments, generateMockData, neodriver), null, true, 'system')
    new CronJob(cronTimes.pointForecast.valid ? cronTimes.pointForecast.cron : '0 10 * * *', () => runPointForecastServices(roadSegments, neodriver), null, true, 'system')
    new CronJob(cronTimes.announcement.valid ? cronTimes.announcement.cron : '*/15 * * * *', () => runAnnouncementServices(neodriver, digiTrafficUrl), null, true, 'system')
  } catch (error) {
    errorWithTimeStamp(`Error with CRON jobs: ${error}`)
  }
}

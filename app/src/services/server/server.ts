import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { dataPoller } from '../../services/dataPollerService'
import { neo4jService } from '../neo4jService'
import { SegmentWithNodes } from '../../types/roadSegmentTypes'
import { setApiCreds } from '../../controllers/login'
import { taskSchedulerService } from '../taskSchedulerService'
import { logWithTimestamp } from '../../utils/logWithTimeStamp'
import { setRoutes } from './routeSetter'
import { Driver } from 'neo4j-driver'
import { setCronTimes } from '../../utils/cronValidator'

dotenv.config()

const PORT = 3000
const uri = process.env.NEOURI
const user = process.env.NEOUSER
const password = process.env.NEOPASS
const boundingBox = process.env.BBOX
const apiUsername = process.env.API_USERNAME
const apiPassword = process.env.API_PASSWORD
const apiSecret = process.env.API_SECRET
const s3Url = process.env.S3_URL
const roadIndexCron = process.env.ROAD_INDEX_CRON
const plowCron = process.env.PLOW_CRON
const pointForecastCron = process.env.POINT_FORECAST_CRON
const announcementCron = process.env.ANNOUNCEMENT_CRON
const generateMockData = process.env.CREATE_MOCK_DATA
const digiTrafficUrl = process.env.DIGITRAFFIC_URL

if (!roadIndexCron || !plowCron || !pointForecastCron || !announcementCron) {
  throw new Error('Please provide CRON timing environment variables: ROAD_INDEX_CRON, PLOW_CRON, POINT_FORECAST_CRON, ANNOUNCEMENT_CRON')
}

if (!uri || !user || !password) {
  throw new Error('Please provide necessary Neo4J environment variables: uri, user & password')
}

if (!boundingBox) {
  throw new Error('Please provide a bounding box for the data')
}

if (!apiPassword || !apiUsername) {
  throw new Error('Please provide username and password to use for the API')
}

if (!apiSecret) {
  throw new Error('Please provide a secret for api token encrypting')
}

if (!s3Url) {
  throw new Error('Please provide a URL to the FMI S3 bucket')
}

if (!digiTrafficUrl) {
  throw new Error('Please provide a URL to the digitraffic API')
}
if (!generateMockData) {
  throw new Error('Please provide a value to allow mock data generation')
}

/**
 * Function that ensures a graceful shutdown if the app
 * is closed. Ensures that the Neo4J driver connection
 * is closed before quitting.
 */
const ensureGracefulShutdown = (neodriver: Driver) => {
  const gracefulShutdown = async () => {
    logWithTimestamp('The app is shutting down...')
    await neodriver.close()
    logWithTimestamp('Neo4j driver closed. The app will shut down now.')
    process.exit(0)
  }

  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
}

/**
 * Function that initializes the express application
 * and calls the functions required by the business
 * logic of the app.
 */
export const runServer = async () => {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '200mb' }))

  setApiCreds(apiUsername, apiPassword, apiSecret)
  const neodriver = await neo4jService.connect(uri, user, password, 20, 20000, 1)
  ensureGracefulShutdown(neodriver)
  setRoutes(app, neodriver, apiUsername, apiSecret)

  const bBoxArray = boundingBox.split(',').map((element) => Number(element))
  const roadSegments: SegmentWithNodes[] = await dataPoller.getSegments([
    [bBoxArray[0], bBoxArray[1]],
    [bBoxArray[2], bBoxArray[3]],
  ])

  app.listen(PORT, () => {
    logWithTimestamp('Server running on port ' + PORT)
  })
  const mockDataPermission = generateMockData === 'true' ? true : false
  const cronTimes = setCronTimes(roadIndexCron, plowCron, pointForecastCron, announcementCron)
  await taskSchedulerService.runAllJobs(roadSegments, mockDataPermission, neodriver, s3Url, digiTrafficUrl)
  taskSchedulerService.runTimedJobs(roadSegments, mockDataPermission, neodriver, s3Url,digiTrafficUrl, cronTimes)
}

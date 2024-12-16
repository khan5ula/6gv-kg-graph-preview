import { CronJob } from 'cron'
import { logWithTimestamp } from './logWithTimeStamp'
import { CronTimes } from '../types/timingTypes'

/**
 * Function that checks whether the received string is a
 * valid CRON job.
 * @param cronJob string: The cron job to check, eg: '0 10 * * *'
 * @return boolean true if the received syntax was correct, false if not.
 * @author Kristian Hannula
 */
const isValidCron = (cronJob: string) => {
  try {
    const testJob = new CronJob(cronJob, () => {})
    testJob.stop()
    return true
  } catch (error) {
    logWithTimestamp(`Cron job ${cronJob} was not valid, using fallback schedule instead`)
    return false
  }
}

/**
 * Utility function that sets the values to a cronTimes object and
 * validates the received cron jobs. Sets the value of a cron object
 * validity to false if the schedule was not correct.
 * @param roadIndexCron string: Road Index CRON time as string
 * @param plowCron string: Plow CRON time as string
 * @param pointForecastCron string: Point Foreacast CRON time as string
 * @returns cronTimes CronTimes: Cron Times object
 * @author Kristian Hannula
 */
export const setCronTimes = (roadIndexCron: string, plowCron: string, pointForecastCron: string, announcementCron: string) => {
  const cronTimes: CronTimes = {
    roadIndex: {
      cron: roadIndexCron,
      valid: isValidCron(roadIndexCron),
    },
    plow: {
      cron: plowCron,
      valid: isValidCron(plowCron),
    },
    pointForecast: {
      cron: pointForecastCron,
      valid: isValidCron(pointForecastCron),
    },
    announcement:{
      cron: announcementCron,
      valid: isValidCron(announcementCron)
    },

  }

  return cronTimes
}

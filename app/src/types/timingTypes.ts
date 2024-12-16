export interface CronEntry {
  cron: string
  valid: boolean
}

export interface CronTimes {
  roadIndex: CronEntry
  plow: CronEntry
  pointForecast: CronEntry
  announcement: CronEntry
}

import { setCronJobs, runAll } from './task_scheduler/taskScheduler'

export const taskSchedulerService = {
  runAllJobs: runAll,
  runTimedJobs: setCronJobs,
}

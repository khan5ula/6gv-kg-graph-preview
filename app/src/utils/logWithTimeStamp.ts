/**
 * Utility function that attaches a timestamp to the console log.
 * Example output: [2024-03-27T13:32:53.831Z] Your message here
 * @author Kristian Hannula
 */
export const logWithTimestamp = (message: string) => {
  const timestamp: string = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`)
}

/**
 * Utility function that attaches a timestamp to the console error.
 * Example output: [2024-03-27T13:32:53.831Z] Your error message here
 * @author Kristian Hannula
 */
export const errorWithTimeStamp = (message: string) => {
  const timestamp: string = new Date().toISOString()
  console.error(`[${timestamp}] ${message}`)
}

import convert from 'color-convert'
import { HSV } from 'color-convert/conversions'


/**
 * A function for randomizing time stamps within a time window
 * @param {number} timeWindow A time window in hours where the generated timestamp will be in
 * @returns {number} An epoch time stamp
 */
export const getTime = (timeWindow: number): number => {
  return Math.floor(Date.now() - timeWindow * 3600000 * Math.random())
}


/**
 * A utility function to help visualize the effect of time in a time window
 * @param timeWindow  A time window in hours where all of the timestamps within a data set will be
 * @param time An epoch timestamp of a member in the data set
 * @returns {string} A hex code
 */
export const getLineColor = (timeWindow: number, time: number): string => {
  const degAmount = 1 - (Date.now() - time) / (timeWindow * 3600000)
  const hsv: HSV = [155 * degAmount < 0 ? 360 - 155 * degAmount : 155 * degAmount, 100, 100]
  return `#${convert.hsv.hex(hsv)}`
}

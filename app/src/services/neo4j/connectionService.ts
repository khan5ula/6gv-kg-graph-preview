import neo4j, { Driver } from 'neo4j-driver'
import { logWithTimestamp, errorWithTimeStamp } from '../../utils/logWithTimeStamp'

/**
 * @async
 * Function that tries to establish a connection to a Neo4J service using the provided
 * credentials. If the connection fails, the function retries a given number of times.
 *
 * @param uri: string The uri for Neo4J service, originally provided as ENV
 * @param user: string Neo4J username, originally provided as ENV
 * @param password: string Neo4J password, originally provided as ENV
 * @param maxRetries: number The number of times the function will retry the connection
 * until it gives up
 * @param delay: number The delay between retries in milliseconds.
 * @param attempt: number (optional) The number of connection attempts.
 *
 * @returns Promise: Driver The neo4j driver if the connection was established.
 */
export const connectServerToNeo4J = async (uri: string, user: string, password: string, maxRetries: number, delay: number, attempt: number): Promise<Driver> => {
  if (!uri || !user || !password) {
    throw new Error('Please provide necessary Neo4J environment variables: uri, user & password')
  }

  try {
    const neodriver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const status = await neodriver.getServerInfo()
    logWithTimestamp(`Neo4J connection estabilished: ${JSON.stringify(status)}`)
    return neodriver
  } catch (error) {
    errorWithTimeStamp(`Attempt ${attempt}: Could not connect to Neo4J: ${error}`)
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return connectServerToNeo4J(uri, user, password, maxRetries, delay, attempt + 1)
    } else {
      errorWithTimeStamp(`Max retries reached. Stopping trying to establish connection to Neo4J.`)
      throw new Error(`Could not connect to Neo4J after ${maxRetries} attempts.`)
    }
  }
}

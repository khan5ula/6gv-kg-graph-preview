import { AxiosError } from "axios"
import { Request } from "express"
import { LoginCreds, RequestBody, RouteSegments } from "../types/httpReqTypes"
import { LatLonTuple } from "../types/geoSpatialTypes"


/**
 * Validating requests on /kg/segments
 * @param {Request} req Request object from client 
 * @returns {number[]} Array of segment ids
 * @throws {AxiosError} AxiosError when input is invalid
 * @author Atte Oksanen
 */
const validateSegments = (req: Request): number[] => {
  if (req.method === 'GET') {
    const httpQuery = req.query as { segments: string }
    if (!httpQuery.segments) {
      throw new AxiosError(`invalid request - query string must include field 'segments'`, '400')
    }
    const queryIds = httpQuery.segments.split(',').map((charNumber) => parseInt(charNumber))
    for (const id of queryIds) {
      if (isNaN(id)) {
        throw new AxiosError('invalid request - query string must include only id numbers', '400')
      }
    }
    return queryIds
  }

  if (req.method === 'POST') {
    const body: RequestBody<RouteSegments> = req.body
    if (!body.data || body.data.length < 1) {
      throw new AxiosError(`invalid request - request body must include 'data'-field`, '400')
    }
    for (const segmentId of body.data) {
      if (typeof segmentId !== 'number') {
        throw new AxiosError('invalid request - request body must only contain an array of id numbers', '400')
      }
    }
    return body.data
  }

  throw new AxiosError('invalid request type - this endpoint accepts only GET and POST requests', '400')
}

/**
 * Validating requests on /kg/route
 * @param {Request} req Request object from client 
 * @returns {LatLonTuple[]} Array of Latitude longitude tuples
 * @throws {AxiosError} AxiosError when input is invalid
 * @author Atte Oksanen
 */
const validateRouteWaypoints = (req: Request): LatLonTuple[] => {
  if (req.method === 'GET') {
    const query = req.query as { coordinates: string }
    if (!query.coordinates) {
      throw new AxiosError(`invalid request - query string must include field 'coordinates'`, '400')
    }
    const coords = query.coordinates.split(',').map((charNumber) => parseFloat(charNumber))
    if (coords.length % 2 !== 0) {
      throw new AxiosError('invalid request - request must include coordinates in pairs', '400')
    }
    for (const coord of coords) {
      if (isNaN(coord)) {
        throw new AxiosError('invalid request - request body must include only lat/lon coordinate pairs', '400')
      }
    }
    const coordinates: LatLonTuple[] = []
    for (let i = 0; i < coords.length; i += 2) {
      coordinates.push([coords[i], coords[i + 1]])
    }
    return coordinates
  }

  if (req.method === 'POST') {
    const body: RequestBody<LatLonTuple[]> = req.body
    if (!body.data || body.data.length < 1) {
      throw new AxiosError(`invalid request - request body must include 'data'-field`, '400')
    }
    for (let i = 0; i < body.data.length; i++) {
      if (body.data[i].length !== 2 || typeof body.data[i][0] !== 'number' || typeof body.data[i][1] !== 'number') {
        throw new AxiosError('invalid request - request body must include only lat/lon coordinate pairs', '400')
      }
    }
    return body.data
  }

  throw new AxiosError('invalid request type - this endpoint accepts only GET and POST requests', '400')
}


/**
 * Validating requests on /routing/segments
 * @param {Request} req Request object from client 
 * @returns {number[]} Array containing node ids
 * @author Atte Oksanen
 */
const validateNodes = (req: Request): number[] => {
  if (req.method === 'GET') {
    const query = req.query as { nodes: string }
    if (!query.nodes) {
      throw new AxiosError(`invalid request - query string must include field 'nodes'`, '400')
    }
    const nodeIds = query.nodes.split(',').map(element => Number(element))
    for (const node of nodeIds) {
      if (isNaN(node)) {
        throw new AxiosError('invalid request - request body must include only node id numbers', '400')
      }
    }
    return nodeIds
  }

  if (req.method === 'POST') {
    const body: RequestBody<RouteSegments> = req.body
    if (!body.data || body.data.length < 1) {
      throw new AxiosError(`invalid request - request body must include 'data'-field`, '400')
    }
    for (const nodeId of body.data) {
      if (isNaN(nodeId)) {
        throw new AxiosError('invalid request - request body must include only node id numbers', '400')
      }
    }
    return body.data
  }

  throw new AxiosError('invalid request type - this endpoint accepts only GET and POST requests', '400')
}

/**
 * Validating requests on /login
 * @param {Request} req Request object from client
 * @returns { username: string, password: string } Type checked username and password
 * @author Atte Oksanen
 */
const validateLoginCredentials = (req: Request): { username: string, password: string } => {
  const body: RequestBody<LoginCreds> = req.body
  if (!body.data) {
    throw new AxiosError(`invalid request - request body must include 'data'-field`, '400')
  }
  if (!body.data.username || !body.data.password) {
    throw new AxiosError(`invalid request - request body must include 'username'-field and 'password'-field`, '400')
  }
  if (typeof body.data.username !== 'string' || typeof body.data.password !== 'string') {
    throw new AxiosError(`invalid request - request username and password fields must include only strings`, '400')
  }
  return body.data
}


const validateToken = (req: Request): string => {
  const auth = req.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }
  throw new AxiosError('Received invalid token', '401')
}

/**
 * A wrapper object for validating HTTP request parameters
 * @author Atte Oksanen
 */
export const validator = {
  validateSegments,
  validateRouteWaypoints,
  validateNodes,
  validateLoginCredentials,
  validateToken
}
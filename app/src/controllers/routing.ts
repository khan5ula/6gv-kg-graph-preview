import { NextFunction, Request, Response } from 'express'
import { dataPoller } from '../services/dataPollerService'
import { validator } from '../utils/inputValidator'

/**
 * @async
 * Controller function that receives coordinate pairs
 * in request.query or request.body.data depending
 * on the request type (GET or POST), and passes them
 * to validator.
 *
 * Reads GET and POST requests.
 *
 * If the nodes are valid, responds with route, which is
 * a list of RoadSegment ID's.
 */
export const getRouteUsingCoordinates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await dataPoller.getRoute(validator.validateRouteWaypoints(req)))
  } catch (error) {
    next(error)
  }
}

/**
 * @async
 * Controller function that receives a list of Node ID's
 * in request.query or request.body.data depending
 * on the request type (GET or POST), and passes them
 * to validator and dataPoller.
 *
 * Reads GET and POST requests.
 *
 * If the nodes are valid, responds with route, which is
 * a list of RoadSegment ID's.
 */
export const getRouteUsingNodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await dataPoller.getRouteSegments(validator.validateNodes(req)))
  } catch (error) {
    next(error)
  }
}

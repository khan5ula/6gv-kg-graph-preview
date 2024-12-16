import express from 'express'
import { getHealth } from '../controllers/health'

export const healthRouter = express.Router()

/**
 * Route that responds to GET requests with
 * a status of 200 OK if the route is available.
 * Can be used for health checks.
 */
healthRouter.get('/', getHealth)

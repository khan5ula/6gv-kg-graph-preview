import express from 'express'
import { getRouteUsingCoordinates, getRouteUsingNodes } from '../controllers/routing'

export const routingRouter = express.Router()

// Path to get route using coordinates, with GET
routingRouter.get('/', getRouteUsingCoordinates)

// Path to get route using coordinates, with POST
routingRouter.post('/', getRouteUsingCoordinates)

// Path to get route using nodes, with GET
routingRouter.get('/segments', getRouteUsingNodes)

// Path to get route using nodes, with POST
routingRouter.post('/segments', getRouteUsingNodes)


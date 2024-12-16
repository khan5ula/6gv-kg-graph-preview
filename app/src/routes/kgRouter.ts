import express from 'express'
import { getAll, getRouting, postCustomQuery, querySegments } from '../controllers/kg'

export const kgRouter = express.Router()

// Path to get a whole dump of the knowledge graph, using GET
kgRouter.get('/', getAll)

// Path to input a custom READ ONLY cypher query, using POST
kgRouter.post('/query', postCustomQuery)

// Path to query data by route segments, using POST
kgRouter.post('/segments', querySegments)

// Path to query data by route segments, using GET
kgRouter.get('/segments', querySegments)

// Path to get routing data based on coordinates, using POST
kgRouter.post('/route', getRouting)

// Path to get routing data based on coordinates, using GET
kgRouter.get('/route', getRouting)

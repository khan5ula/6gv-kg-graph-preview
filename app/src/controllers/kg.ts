import { NextFunction, Request, Response } from 'express'
import neo4j, { Neo4jError } from 'neo4j-driver'
import { AxiosError } from 'axios'
import { pollKGWithCoords } from '../utils/pollKGWithCoords'
import { queryGenerator } from '../utils/neo4j/queryGenerator'
import { validator } from '../utils/inputValidator'

/**
 * @async
 * Controller function for returning all content from
 * the knowledge graph.
 *
 * Reads GET requests.
 *
 * Uses neo4j.sessionREAD as the defaultAccessMode,
 * meaning only READ ONLY queries are allowed.
 *
 * The function assumes the route has received
 * Neo4J Driver as middleware.
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.neodriver) {
    return next(new Neo4jError('Neo4j driver not found', '500'))
  }

  const session = req.neodriver.session({ defaultAccessMode: neo4j.session.READ })
  const query = queryGenerator.getAll()

  try {
    const result = await session.executeRead((tx) => tx.run(query))
    res.json(result.records.map((record) => record.toObject()))
  } catch (error) {
    next(new Neo4jError(`Could not execute the read request: ${error}`, '502'))
  } finally {
    await session.close()
  }
}

/**
 * @async
 * Controller function that reads a custom Cypher
 * query from request.body.data and executes the query
 * in read only mode.
 *
 * Reads POST requests.
 *
 * Uses neo4j.sessionREAD as the defaultAccessMode,
 * meaning only READ ONLY queries are allowed.
 *
 * The function assumes the route has received
 * Neo4J Driver as middleware.
 */
export const postCustomQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.neodriver) {
      throw new Neo4jError('Neo4j driver not found', '500')
    }
    const session = req.neodriver.session({ defaultAccessMode: neo4j.session.READ })

    try {
      if (!req.body.data || req.body.data.length < 1) {
        throw new AxiosError(`invalid request - request body must include 'data'-field`, '400')
      }

      const query = req.body.data.query

      if (typeof query !== 'string' || query.trim() === '') {
        throw new Neo4jError('Cypher query is expected to be a non-empty string', '400')
      }

      const result = await session.executeRead((tx) => tx.run(query))
      res.json(result.records.map((record) => record.toObject()))
    } catch (error) {
      if (error instanceof Neo4jError) {
        return next(new Neo4jError(`Could not execute the read request: ${error}`, '502'))
      }
      next(error)
    } finally {
      await session.close()
    }
  } catch (error) {
    next(error)
  }
}

/**
 * @async
 * Controller function that receives a list of Road Segment ID's
 * in request.body.data or request.query depending on the request
 * type (POST or GET), and returns data from the knowledge graph
 * containing data of the segments and relating nodes and relations.
 *
 * Reads POST and GET requests.
 *
 * Example GET request:
 * curl -H "Authorization: Bearer <TOKEN>"
 * "http://localhost:3000/kg/segments?segments=5121913,4752178,4752178,4995627"
 *
 * Uses neo4j.sessionREAD as the defaultAccessMode,
 * meaning only READ ONLY queries are allowed.
 *
 * The function assumes the route has received
 * Neo4J Driver as middleware.
 */
export const querySegments = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.neodriver) {
    return next(new Neo4jError('Neo4j driver not found', '500'))
  }

  const session = req.neodriver.session({ defaultAccessMode: neo4j.session.READ })

  try {
    const segmentIds = validator.validateSegments(req)
    const query = queryGenerator.matchBySegmentId(segmentIds)
    const result = await session.executeRead((tx) => tx.run(query))
    res.json(result.records.map((record) => record.toObject()))
  } catch (error) {
    if (error instanceof AxiosError) {
      next(error)
    } else {
      next(new Neo4jError(`Could not execute the read request: ${error}`, '502'))
    }
  } finally {
    await session.close()
  }
}

/**
 * @async
 * Controller function that receives a list of coordinates
 * in request.body.data or request.query depending on the
 * request type (GET or POST), and calls DataPoller to create 
 * a route based on the given coordinates.
 *
 * Reads GET and POST requests.
 *
 * Example POST query:
 * curl -X POST -H "Content-Type: application/json" -H 
 * "Authorization: Bearer <TOKEN> -d '{"data":
 * [[65.0071, 25.4581],[65.0125, 25.4819]]}'
 * http://localhost:3000/kg/route
 *
 * Example GET query:
 * curl -H "Authorization: Bearer <TOKEN>"
 * "http://localhost:3000/kg/route?coordinates=65.0071,25.4581,65.0125,25.4819"

 * Uses neo4j.sessionREAD as the defaultAccessMode,
 * meaning only READ ONLY queries are allowed.
 *
 * The function assumes the route has received
 * Neo4J Driver as middleware.
 */
export const getRouting = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.neodriver) {
    return next(new Neo4jError('Neo4j driver not found', '500'))
  }

  const session = req.neodriver.session({ defaultAccessMode: neo4j.session.READ })

  try {
    const coordPairs = validator.validateRouteWaypoints(req)
    res.json(await pollKGWithCoords(session, coordPairs))
  } catch (error) {
    if (error instanceof AxiosError) {
      next(error)
    } else {
      next(new Neo4jError(`Could not execute the read request: ${error}`, '502'))
    }
  } finally {
    await session.close()
  }
}

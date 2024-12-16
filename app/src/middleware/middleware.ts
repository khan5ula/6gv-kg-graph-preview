import { Request, Response, NextFunction } from 'express'
import { Driver, Neo4jError } from 'neo4j-driver'
import { AxiosError } from 'axios'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { validator } from '../utils/inputValidator'

/**
 * Middleware function that attaches neodriver to routes that
 * are declared after app.use(attachNeodriver(neodriver)) has been called.
 *
 * Uses the declared 'express-serve-static-core' module found in /types
 * to attach neodriver to Request object.
 *
 * @param neodriver Driver: Neo4J Driver
 * @author Kristian Hannula
 */
export const attachNeoDriver = (neodriver: Driver) => (req: Request, res: Response, next: NextFunction) => {
  if (!neodriver) {
    return res.status(500).json({ message: `Neo4j driver was not found` })
  }

  req.neodriver = neodriver
  next()
}

/**
 * Middleware function that authenticates the user based on the credentials
 * received in the HTTP request.
 *
 * Checks whether the received token is valid and whether it is less than
 * 7 days old.
 *
 * @param username string: The approved username, originally received in ENV.
 * @param secret string: The approved password, originally received in ENV.
 * @author Atte Oksanen
 */
export const authenticateUser = (username: string, secret: string) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const decodedToken = jwt.verify(validator.validateToken(req), secret) as JwtPayload
    if (decodedToken.username === username && Date.now() - decodedToken.timestamp < 604800000) {
      next()
    } else {
      throw new JsonWebTokenError('Token contains invalid credentials')
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Middleware function that works as the error handler for router of this app.
 *
 * Checks whether the error is instance of Neo4JError, AxiosError or JsonWebTokenError.
 * If the instance of the error is not recognized, returns a general internal server error.
 *
 * @param error Error: The error this handler received.
 * @author Atte Oksanen
 */
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Neo4jError || error instanceof AxiosError) {
    return res.status(Number(error.code)).json({ message: error.message })
  } else if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ message: error.message })
  } else {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

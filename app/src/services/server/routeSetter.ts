import { Express } from 'express'
import { Driver } from 'neo4j-driver'
import { healthRouter } from '../../routes/healthRouter'
import { loginRouter } from '../../routes/loginRouter'
import { routingRouter } from '../../routes/routingRouter'
import { kgRouter } from '../../routes/kgRouter'
import { errorHandler } from '../../middleware/middleware'
import { authenticateUser } from '../../middleware/middleware'
import { attachNeoDriver } from '../../middleware/middleware'

/**
 * Function that sets the Routes and middleware
 * to the app.
 * @param app Express: The express application
 * @param neodriver Driver: Neo4J Driver
 */
export const setRoutes = (app: Express, neodriver: Driver, apiUsername: string, apiSecret: string) => {
  app.use('/health', healthRouter)
  app.use('/login', loginRouter)
  app.use('/routing', authenticateUser(apiUsername, apiSecret), routingRouter)
  app.use(attachNeoDriver(neodriver))
  app.use('/kg', authenticateUser(apiUsername, apiSecret), kgRouter)
  app.use('*', (req, res) => res.status(404).json({ message: 'API endpoint not found' }))
  app.use(errorHandler)
}

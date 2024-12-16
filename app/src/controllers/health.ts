import { Request, Response } from 'express'

/**
 * Controller function that returns status 200 'ok'
 * if the route is accessible, indicating that the
 * server is available.
 */
export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({ message: 'server ok' })
}

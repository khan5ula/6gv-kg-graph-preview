import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AxiosError } from 'axios'
import { validator } from '../utils/inputValidator'

let username = ''
let password = ''
let secret = ''

export const setApiCreds = (tempUsername: string, tempPassword: string, tempSecret: string) => {
  username = tempUsername
  password = tempPassword
  secret = tempSecret
}

/**
 * Controller function that receives username, password and api secret
 * in request.body.data.
 *
 * Passes the received information to validator to check whether
 * the credentials match with the ones defined in .ENV.
 *
 * If the login is approved, responds with a Bearer Token.
 */
export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  if (username === '' || password === '' || secret === '') {
    throw new Error('API credentials could not be retrieved')
  }

  try {
    const creds = validator.validateLoginCredentials(req)
    if (creds.password === password && creds.username === username) {
      const tokenObject = {
        username: creds.username,
        timestamp: Date.now(),
      }
      const token = jwt.sign(tokenObject, secret)
      res.json({ username: creds.username, token: token, loginTime: tokenObject.timestamp })
    } else {
      throw new AxiosError('Invalid credentials', '401')
    }
  } catch (error) {
    next(error)
  }
}

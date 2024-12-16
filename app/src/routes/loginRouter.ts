import express from 'express'
import { loginPost } from '../controllers/login'

export const loginRouter = express.Router()

// Route that receives login credentials in POST request
loginRouter.post('/', loginPost)

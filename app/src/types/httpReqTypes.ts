import { Driver } from 'neo4j-driver'

declare module 'express-serve-static-core' {
  interface Request {
    neodriver?: Driver
  }
}

export type RouteSegments = number[]

// Used in req.body.data to post cypher queries to /kg route
export type query = string

export interface LoginCreds {
  username: string
  password: string
}

export interface RequestBody<T> {
  data: T
}

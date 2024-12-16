import { Integer } from "neo4j-driver";

export type CypherParameters = {
  [key: string]: string | number | boolean | Integer | { latitude: number; longitude: number }
}

export type CypherCommand = {
  query: string
  parameters: CypherParameters
}

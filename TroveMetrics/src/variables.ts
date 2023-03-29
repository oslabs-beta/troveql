import { userInfo } from 'os';
import path from 'path'

export type queryData = {
  cacheHit?: boolean,
  query: string,
  variables: {},
  lookupTime?: number
}

export type localData = {
  cache: {
    HIT: number,
    MISS: number
  }
  queries: queryData[]
}

export type Error = {
  log?: string,
  status?: number,
  message?: { 
    err?: string
  },
}

export const TroveQLPath: string = path.join(userInfo().homedir, '/TroveQL/')

export const defaultData: localData = {
  cache: {
    HIT: 0, 
    MISS: 0 
  }, 
  queries: []
}

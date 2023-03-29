import { userInfo } from 'os';
import path from 'path'

export type queryData = {
  cacheHit: boolean,
  query: string,
  variables: {},
}

type localData

export type Error = {
  log?: string,
  status?: number,
  message?: { 
    err?: string
  },
}

export const TroveQLPath: string = path.join(userInfo().homedir, '/TroveQL/')

export const defaultData = {
  cache: {
    HIT: 0, 
    MISS: 0 
  }, 
  queries: queryData[]
}

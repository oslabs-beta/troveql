import { userInfo } from 'os';
import path from 'path'

export const TroveQLPath: string = path.join(userInfo().homedir, '/TroveQL/')

export const defaultData = {
  cache: {
    HIT: 0, 
    MISS: 0 
  }, 
  query: '',
  variables: {}
}

export type Error = {
  log?: string,
  status?: number,
  message?: { 
    err?: string
  },
}
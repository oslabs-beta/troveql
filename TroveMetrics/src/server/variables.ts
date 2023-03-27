import { userInfo } from 'os';
import path from 'path'

export const TroveQLPath: string = path.join(userInfo().homedir, '/TroveQL/metrics data')

export const defaultData = {
  cache: [
    { type: 'HIT', value: 0 }, 
    { type: 'MISS', value: 0 }, 
  ],
  query: '',
}

export type Error = {
  log?: string,
  status?: number,
  message?: { 
    err?: string
  },
}
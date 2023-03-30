import { type } from 'os';

type Variables = {
  [key: string]: string;
};
type RequestBody = {
  query: string;
  variables: Variables;
};
type ItemType = {
  value: string;
  hits: number;
};
type CacheType = Map<string, ItemType | boolean>;

type getResponse = {
  result: string;
  miss: string | boolean;
};

type fetchResponse = {
  query: string;
  result: string;
  miss: string;
};

type CacheSizeType = {
  t1: number;
  t2: number;
  b1: number;
  b2: number;
};

export {
  RequestBody,
  ItemType,
  CacheType,
  getResponse,
  fetchResponse,
  CacheSizeType,
};

type ItemType = {
  value: string;
  hits: number;
};

// Map Object with 
  // key: string 
  // value: either ItemType or bolean
type CacheType = Map<string, ItemType | boolean>;

type ResponseType = {
  query?: string;
  result: string;
  miss: string | boolean;
};

type CacheSizeType = {
  t1: number;
  t2: number;
  b1: number;
  b2: number;
  p: number;
};

export {
  ItemType,
  CacheType,
  ResponseType,
  CacheSizeType,
};

type ItemType = {
  value: string;
  hits: number;
};

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
};

export {
  ItemType,
  CacheType,
  ResponseType,
  CacheSizeType,
};

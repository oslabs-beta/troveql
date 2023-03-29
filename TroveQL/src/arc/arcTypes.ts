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

export { RequestBody, ItemType, CacheType, getResponse, fetchResponse };

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

type ResponseType = {
  result: string;
  miss: string | boolean;
};

export { RequestBody, ItemType, CacheType, SetType };

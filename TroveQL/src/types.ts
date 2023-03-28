export type Variables = {
  [ key : string ] : string
};

export type RequestBody = {
  query: string,
  variables: Variables
}
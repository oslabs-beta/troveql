export type Variables = {
  [ key : string ] : string
};

export type QueryInfo = {
  operation: string,
  objectType: string,
  objectFields: string[]
}

// export type Mutations = {
//   [ key: string ]: string[]
// }
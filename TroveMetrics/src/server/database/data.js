export const Data = {
  cache: [
    {
      type: 'HIT',
      value: 25
    },
    {
      type: 'MISS',
      value: 50
    }
  ],
  query: `query {
    movies {
        id
        title
        genre
        year
    }
  }`,
  otherData: null,
}

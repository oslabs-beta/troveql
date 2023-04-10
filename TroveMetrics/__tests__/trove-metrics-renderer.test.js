import CacheChart from "../src/renderer/components/CacheChart";
import QueryDisplay from "../src/renderer/components/QueryDisplay";
import React from "react";
import { render, screen} from '@testing-library/react'


const cacheData = {
  cache: {HIT: 2, MISS: 1},
  capacity: 4,
  queries: [
    {
      cacheHit: true,
      query: "query ($id: ID) {\n      movie(id: $id) {\n          id\n          title\n          genre\n          year\n          actors \n            {\n              name\n            }\n      }\n    }",
      variables: {id: 2},
      cacheSize: {t1: 2,t2: 3,b1: 0,b2: 0,p: 0.5},
      queryTime: 1,
      capacity: 5
    },
    {
      cacheHit: false,
      query: "query ($id: ID) {\n      movie(id: $id) {\n          id\n          title\n          genre\n          year\n          actors \n            {\n              name\n            }\n      }\n    }",
      variables: {id: 66},
      cacheSize: {t1: 2,t2: 3,b1: 1,b2: 0,p: 0.5},
      queryTime: 214,
      capacity: 5
    },
    {
      cacheHit: true,
      query: "Last Query",
      variables: {id: 66},
      cacheSize: {t1: 1,t2: 4,b1: 1,b2: 0,p: 0.5},
      queryTime: 1,
      capacity: 5
    },
  ]
}

describe('Unit testing charts', () => {

  describe('CacheChart renders chart', () => {

    it('Does last query display?', () => {
      const { getByText } = render(<QueryDisplay key='1' cacheData={cacheData} />)

      expect(getByText('Query String').nextSibling).toHaveTextContent('Last Query');
      expect('this').toBe('this')
    })
  })




})
import React from "react";
import { render } from '@testing-library/react';
import CacheChart from "../src/renderer/components/CacheChart";
import QueryDisplay from "../src/renderer/components/QueryDisplay";
import ARCChart from '../src/renderer/components/ARCChart';
import ARCData from '../src/renderer/components/ARCData';


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
      variables: {id: 68},
      cacheSize: {t1: 1,t2: 4,b1: 1,b2: 0,p: 0.5},
      queryTime: 1,
      capacity: 5
    },
  ]
}

describe('Unit testing charts', () => {
  
  describe('QueryDisplay displays', () => {
    
    let component;

    beforeEach(()=> {
      component = render(<QueryDisplay key='1' cacheData={cacheData} />)
    })

    it('Does last query display?', () => {
      expect(component.getByText('Last Query')).toBeInstanceOf(Node);
      expect(component.getByText('id : 68')).toBeInstanceOf(Node);
    })

    it('Do all headings display?', () => {
      expect(component.getByText('Previous Query')).toBeInstanceOf(Node);
      expect(component.getByText('Query String')).toBeInstanceOf(Node);
      expect(component.getByText('Arguments')).toBeInstanceOf(Node);
    })
  })  
  
  // The tests below are only going to check if the image is created by
  // chart.js, not whether the chart is displayed correctly.
  
  describe('CacheChart displays', () => {
    
    let component;
    beforeEach(()=> {
      component = render(<CacheChart key='1' cacheData={cacheData} />)
    })

    it('Does component title display?', () => {
      expect(component.getByText('Cache Hits vs. Misses')).toBeInstanceOf(Node);
    })

    it('Does the chart.js component render?', () => {
      expect(component.getByRole('img')).toBeInstanceOf(Node);
    })
  })

  describe('ARCChart displays', () => {
    
    let component;
    beforeEach(()=> {
      component = render(<ARCChart key='1' cacheData={cacheData} />)
    })

    it('Does component title display?', () => {
      expect(component.getByText('ARC Cache Sizes')).toBeInstanceOf(Node);
    })

    it('Does the chart.js component render?', () => {
      expect(component.getByRole('img')).toBeInstanceOf(Node);
    })
  })

  describe('ARCData displays', () => {
    
    let component;
    beforeEach(()=> {
      component = render(<ARCData key='1' cacheData={cacheData} />)
    })

    it('Does component elements display?', () => {
      expect(component.getByText('Recency vs. Frequency')).toBeInstanceOf(Node);
      expect(component.getByText('Ideal Recency Cache Size: 0.5')).toBeInstanceOf(Node);
    })

    it('Does the chart.js component render?', () => {
      expect(component.getByRole('img')).toBeInstanceOf(Node);
    })
  })

})
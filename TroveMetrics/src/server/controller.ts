import { Request, Response, NextFunction, RequestHandler} from 'express';
import fs from 'fs/promises';
import { TroveQLPath } from '../variables';
import path from 'path';

type controller = {
  post: RequestHandler
}

// Handle post request from troveQL server with cache data
const troveController: controller = {

  post: function(req: Request, res: Response, next: NextFunction) {
    console.log('REQbody', req.body);
    // Pull from local data, add new data, and write back
    fs.readFile(path.join(TroveQLPath, 'metrics.json'), "utf-8")
    .then(data => JSON.parse(data))
    .then(parsedData => {
      // console.log('parsedData', parsedData);
      // Translate Hit / Miss into data format ready for Chart.js
  
      if (req.body.cacheHit === undefined) {
        parsedData.cache['HIT'] = 0;
        parsedData.cache['MISS'] = 0;
        parsedData.queries = [];
        parsedData.capacity = 0;
      } else {
        let hitOrMiss: string = req.body.cacheHit ? 'HIT' : 'MISS';
        parsedData.cache[hitOrMiss] += 1;
        parsedData.queries.push(req.body);
        parsedData.capacity = req.body.capacity;
      }

      // Send file data back to server to pass on to Renderer
      res.locals.data = parsedData

      //Write file to local machine
      fs.writeFile(path.join(TroveQLPath, 'metrics.json'), JSON.stringify(parsedData))
        .catch(error => console.log(error))
      return next();
    }).catch (error => {
      return next({
        log: 'troveController.post',
        status: 400,
        message: { err: 'An error occured in troveController.post:' + error},
      }

      )
    })
  },
};

export { troveController };

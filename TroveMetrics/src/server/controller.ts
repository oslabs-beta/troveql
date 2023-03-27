import { Request, Response, NextFunction, RequestHandler} from 'express';
import fs from 'fs/promises';
import { TroveQLPath } from '../variables';
import path from 'path';

type controller = {
  post: RequestHandler
}

const troveController: controller = {

  post: function(req: Request, res: Response, next: NextFunction) {

    // Pull from local data, add new data, and write back
    fs.readFile(path.join(TroveQLPath, 'metrics.json'), "utf-8")
    .then(data => JSON.parse(data))
    .then(parsedData => {
      // Translate Hit / Miss into data format ready for Chart.js
      let hitOrMiss: string = 'MISS';
      if (req.body.cacheHit) hitOrMiss = 'HIT';
      parsedData.cache[hitOrMiss] += 1;
      parsedData.query = req.body.query;

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

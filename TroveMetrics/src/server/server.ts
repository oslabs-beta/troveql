import { BrowserWindow } from 'electron'
import express, { NextFunction, Request, Response } from 'express';
import { troveController } from './controller';
import { Error } from './variables';

const app = express();

const createServer = function(renderer: BrowserWindow) {
  const port = 3333;
  app.use(express.json());

  app.post('/api', troveController.post, (req: Request, res: Response) => {
    renderer.webContents.send('data:update', res.locals.data);
    res.status(200).send('worked :D');
  });

  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occured'},
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
  
    return res.sendStatus(errorObj.status).json(errorObj.message);
  });


};


export { createServer };

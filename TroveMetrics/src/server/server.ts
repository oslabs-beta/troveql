import { BrowserWindow } from 'electron'
import express, { Request, Response } from 'express';
import { troveController } from './controller';

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
};


export { createServer };

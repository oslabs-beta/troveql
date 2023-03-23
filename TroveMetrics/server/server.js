const { app, BrowserWindow } = require('electron');
const express = require('express');
const expressApp = express();
const troveController = require('./controller');

const port = 3333;

expressApp.use(express.json());

//*Creating Invisible window for Server */
let server;

const createServerWindow = () => {
  server = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
    },
  });
  server.on('closed', () => {
    server = null;
  });
};

app.on('ready', () => {
  expressApp.post('/api', troveController.post, (req, res) => {
    res.status(200).send('worked');
  });
  expressApp.listen(port, () => {
    console.log(`listening on port: ${port}`);
    createServerWindow();
  });
});

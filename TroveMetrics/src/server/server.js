// const { app, BrowserWindow } = require('electron');
const express = require('express');
const app = express();
const troveController = require('./controller');

const createServer = () => {
  const port = 3333;
  app.use(express.json());

  app.post('/api', troveController.post, (req, res) => {
    res.status(200).send('worked :D');
  });

  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
};

module.exports = { createServer };

const express = require('express');
const app = express();
const path = require('path');
const troveController = require('./controller');

const port = 3333;

app.use(express.json());

//server static files

//main route that will send data to main and use ipc main
app.post('/api', troveController.post, (req, res) => {
  res.status(200).send('cool it works!');
});

// route for each metric that we are measuring
app.listen(port, () => console.log(`listening on port: ${port}`));

const express = require("express");
const app = express();
const path = require("path");

const port = 3333;

app.use(express.json());

//server static files


app.get("/", (req, res) => {
  res.send("cool it works!");
});

app.listen(port, () => console.log(`listening on port: ${port}`));

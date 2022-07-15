"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3500;
const connection = require('./settings/mySqlDb');
// const middleware = require('./Middleware/auth')

app.use(cors());

connection.connect((error) => {
  if (error) {
    return console.log("Failed to connect to data base...");
  } else {
    return console.log("Connect to MySQL has been successful...");
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello Guy!')
});

const route = require("./settings/routes");
route(app);

app.listen(port, /* "0.0.0.0", */() => {
  console.log(`App listening on port ${port}`);
});

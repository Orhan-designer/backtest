const mysql = require("mysql2");
const config = require("./../mysqlConfig");

const connection = mysql.createConnection({
  host: config.HOST,
  user: config.DBUSER,
  database: config.DBNAME,
  password: config.DBPASSWORD,
});

module.exports = connection;

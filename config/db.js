'use strict';

var mysql = require('mysql');

var connection = mysql.createConnection({
  "host"     : process.env.JAWSDB_URL || "localhost",
  "user"     : 'root',
  "password" : 'qn4nzpmw',
  "database" : 'bankingappdb'
});

connection.connect();

module.exports = connection;

'use strict';

var mysql = require('mysql');

var connection = mysql.createConnection({
  "host"     : 'localhost',
  "user"     : 'root',
  "password" : 'qn4nzpmw',
  "database" : 'bankingappdb'
});

connection.connect();

module.exports = connection;

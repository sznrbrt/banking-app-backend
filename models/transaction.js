'use strict';

var db = require('../config/db');

db.query(`CREATE TABLE IF NOT EXISTS transactions(
            date TEXT,
            description TEXT,
            note TEXT,
            entry TEXT,
            dr INTEGER,
            cr INTEGER,
            id int PRIMARY KEY AUTO_INCREMENT)`);

exports.getAll = function(callback) {
  db.query('SELECT * FROM transactions', callback);
}

exports.create = function(transaction, callback) {
  if(!transaction) return callback('You must define a transaction!');

  var newTransaction = {
      date: transaction.date,
      description: transaction.description,
      note: transaction.note || "-",
      entry: transaction.entry,
      dr: transaction.dr,
      cr: transaction.cr,
      entryvalue: transaction.entryvalue
  };

  db.query(`INSERT INTO transactions (date, description, note, entry, dr, cr)
              VALUES ('${newTransaction.date}',
                      '${newTransaction.description}',
                      '${newTransaction.note}',
                      '${newTransaction.entry}',
                      '${newTransaction.dr}',
                      '${newTransaction.cr}')`,
              callback(null, newTransaction));
}

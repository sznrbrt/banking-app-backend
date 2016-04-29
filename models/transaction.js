'use strict';

var db = require('../config/db');
var moment = require('moment');

db.query(`CREATE TABLE IF NOT EXISTS transactions(
            date TEXT,
            description TEXT,
            note TEXT,
            entry TEXT,
            dr INTEGER,
            cr INTEGER,
            timestamp TEXT,
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
      entryvalue: transaction.entryvalue,
      timestamp: moment()
  };

  db.query(`INSERT INTO transactions (date, description, note, entry, dr, cr, timestamp)
              VALUES ('${newTransaction.date}',
                      '${newTransaction.description}',
                      '${newTransaction.note}',
                      '${newTransaction.entry}',
                      '${newTransaction.dr}',
                      '${newTransaction.cr}',
                      '${newTransaction.timestamp}')`,
              callback);
}

exports.delete = function(id, callback) {
  if(!id) return callback('Error! You must define an id!');
  db.query(`DELETE FROM transactions WHERE id = '${id}';`, callback(null))
}

exports.edit = function(id, modTransaction, callback) {
  if(!id || !modTransaction) return callback('Error! You must define an id!');
  db.query(`UPDATE transactions
                SET date = '${modTransaction.date}',
                    description = '${modTransaction.description}',
                    note = '${modTransaction.note}',
                    entry = '${modTransaction.entry}',
                    dr = '${modTransaction.dr}',
                    cr = '${modTransaction.cr}'
                WHERE id = '${id}';`, callback(null));
}

'use strict';

var express = require('express');
var router = express.Router();
var Transaction = require('../models/transaction');

// /api/transactions

router.route('/')
  .get((req, res) => {
    Transaction.getAll((err, transactions) => {
      if(err) return res.status(400).send(err);
      res.send(transactions);
    })
  })
  .post((req, res) => {
    var todo = req.body;
    Transaction.create(todo, (err, transaction) => {
      if(err) return res.status(400).send(err);
      res.send('You have added a new transaction!');
    })
  })


module.exports = router;

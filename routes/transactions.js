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
      res.send(transaction);
    })
  })

router.route('/:id')
  .delete((req, res) => {
    Transaction.delete(req.params.id, (err) => {
      res.status(err ? 400 : 200).send(err || 'You have deleted the transaction!');
    })
  })
  .put((req, res) => {
    Transaction.edit(req.params.id, req.body, (err) => {
      res.status(err ? 400 : 200).send(err || 'You have edited the transaction!');
    })
  })

module.exports = router;

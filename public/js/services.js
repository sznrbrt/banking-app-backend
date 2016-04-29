'use strict';

var app = angular.module('bankingApp');

app.service('Transaction', function($http) {
  this.getAll = () => {
    return $http.get('/api/transactions');
  }

  this.create = (transaction) => {
    return $http.post('/api/transactions', transaction);
  }

  this.remove = (id) => {
    return $http.delete(`/api/transactions/${id}`);
  }

  this.edit = (id, modTransaction) => {
    return $http.put(`/api/transactions/${id}`, modTransaction);
  }
})

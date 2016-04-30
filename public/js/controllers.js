'use strict';

var app = angular.module('bankingApp');

app.controller('mainCtrl', function($scope, Transaction, $uibModal) {

  Transaction.getAll()
    .then((res) => {
      $scope.transactions = res.data;
      getBalance();
    })
    .catch((err) => {
      console.error('err:', err);
    });


  $scope.clearInput = () => {
    $scope.newTransactionForm = {};
  }

  $scope.addEntry = () => {
    var newTransactionForm = $scope.newTransactionForm;
    var newTransaction = {};

      if(!newTransaction.date) return;
      if(!newTransaction.description) return;
      if(!newTransaction.entry) return;
      if(!newTransaction.entryValue) return;
      newTransaction.date = newTransactionForm.date;
      newTransaction.description = newTransactionForm.description;
      newTransaction.note = newTransactionForm.note;
      newTransaction.entry = newTransactionForm.entry;
      if(newTransactionForm.entry === 'Credit'){
        newTransaction.cr = Math.abs(newTransactionForm.entryValue);
        newTransaction.dr = 0;
      } else {
        newTransaction.cr = 0;
        newTransaction.dr = Math.abs(newTransactionForm.entryValue);
      };

      Transaction.create(newTransaction)
      .then((res) => {
        var newTransactionID = res.data.insertId;
        newTransaction.id = newTransactionID;
        $scope.transactions.push(newTransaction);
        $scope.newTransactionForm = {};
        getBalance();
      })
      .catch(err => {
        console.error(err);
      });
  }

  $scope.deleteEntry = (transaction) => {
    var index = $scope.transactions.indexOf(transaction);
    var id = transaction.id
    Transaction.remove(id)
    .then(() => {
      $scope.transactions.splice(index, 1);
      getBalance();
    })
    .catch(err => {
      console.error(err);
    });
  }

  $scope.selectTransaction = (transaction) => {
    var modalInstance = $uibModal.open({
      controller: 'editModalCtrl',
      templateUrl: 'editModal.html',
      resolve: {
        transaction: function() {
          return transaction;
        }
      }
    });
    modalInstance.result.then(function(editedtransaction){
      var index = $scope.transactions.indexOf(transaction);
      Transaction.edit(transaction.id, editedtransaction)
      .then(() => {
        $scope.transactions[index] = editedtransaction;
        getBalance();
      })
      .catch(err => {
        console.error(err);
      });
    }, function(){
      console.log('failure!');
    })
  };

  $scope.sortBy = (order) => {
    if($scope.sortOrder === order) {
      $scope.sortOrder = "-" + order;
    } else {
      $scope.sortOrder = order;
    }
  };

  function getBalance() {
    $scope.totalDebit = $scope.transactions.reduce(function(acc, transaction){
      return acc + transaction.dr;
    }, 0);
    $scope.totalCredit = $scope.transactions.reduce(function(acc, transaction){
      return acc + transaction.cr;
    }, 0);
    $scope.totalBalance = $scope.totalCredit - $scope.totalDebit;
  }

});

app.controller('editModalCtrl', function($scope, $uibModalInstance, transaction, Transaction) {
  $scope.editedtransaction = angular.copy(transaction);
  $scope.editedtransaction.cr = Math.abs($scope.editedtransaction.cr);
  $scope.editedtransaction.dr = Math.abs($scope.editedtransaction.dr);
  $scope.ok = function() {
    console.log('ok')
    if($scope.editedtransaction.entry === 'Credit') $scope.editedtransaction.dr = 0;
    else $scope.editedtransaction.cr = 0;
    $uibModalInstance.close($scope.editedtransaction);
  };
  $scope.cancel = function() {
    console.log('cancel');
    $uibModalInstance.dismiss();
  };
})

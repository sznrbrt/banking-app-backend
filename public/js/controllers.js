'use strict';

var app = angular.module('bankingApp');

app.controller('mainCtrl', function($scope, Transaction, $uibModal) {

  Transaction.getAll()
    .then((res) => {
      $scope.transactions = res.data;
    })
    .catch((err) => {
      console.error('err:', err);
    });

  $scope.clearInput = () => {
    $scope.note = "";
    $scope.description = "";
    $scope.date = undefined;
    $scope.entryValue = undefined;
    $scope.entry = undefined;
  }

  $scope.addEntry = () => {
    var newTransactionForm = $scope.newTransactionForm;
    var newTransaction = {};
      newTransaction.date = newTransactionForm.date;
      newTransaction.description = newTransactionForm.description;
      newTransaction.note = newTransactionForm.note;
      newTransaction.entry = newTransactionForm.entry;
      if(newTransactionForm.entry === 'Credit'){
        newTransaction.cr = newTransactionForm.entryValue;
        newTransaction.dr = 0;
      } else {
        newTransaction.cr = 0;
        newTransaction.dr = newTransactionForm.entryValue;
      };

      Transaction.create(newTransaction)
      .then((res) => {
        console.log(res);
        var newTransactionID = res.data.insertId;
        newTransaction.id = newTransactionID;
        $scope.transactions.push(newTransaction);
        $scope.newTransactionForm = {};
      })
      .catch(err => {
        console.error(err);
      });
  }

  $scope.deleteEntry = (transaction) => {
    var index = $scope.transactions.indexOf(transaction);
    var id = transaction.id
    console.log(index);
    console.log(id);
    Transaction.remove(id)
    .then(() => {
      console.log(index);
      $scope.transactions.splice(index, 1);
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
      console.log('initalized');
      $scope.transactions[index] = editedtransaction;
    }, function(){
      console.log('failure!');
    })
  };

  // $scope.openEditEntry = (transaction) => {
  //   $('.modal').modal('show');
  //
  //   var index = $scope.transactions.indexOf(transaction);
  //   var underEdit = $scope.transactions[index];
  //
  //   $scope.modalDescription = underEdit.description;
  //   $scope.modalDate = underEdit.date;
  //   $scope.modalEntry = underEdit.entry;
  //   $scope.modalEntryValue = underEdit.cr || underEdit.dr;
  //   $scope.modalNote = underEdit.note;
  //   $scope.underEditIndex = index;
  // };
  //
  // $scope.editEntry = () => {
  //   var index = $scope.underEditIndex;
  //   var edited = {};
  //   edited.description = $scope.modalDescription;
  //   edited.date = $scope.modalDate;
  //   edited.entry = $scope.modalEntry;
  //   if(edited.entry === 'Debit') {
  //     edited.dr = $scope.modalEntryValue;
  //     edited.cr = 0;
  //   }
  //   if(edited.entry === 'Credit') {
  //     edited.cr = $scope.modalEntryValue;
  //     edited.dr = 0;
  //   }
  //   edited.note = $scope.modalNote;
  //   $scope.transactions[index] = edited;
  //   $('.modal').modal('hide');
  //   // getBalance();
  // };

  $scope.sortBy = (order) => {
    if($scope.sortOrder === order) {
      $scope.sortOrder = "-" + order;
    } else {
      $scope.sortOrder = order;
    }
  };

  // function getBalance() {
  //   $scope.totalDebit = $scope.transactions.reduce(function(acc, transaction){
  //     return acc + transaction.dr;
  //   }, 0);
  //   $scope.totalCredit = $scope.transactions.reduce(function(acc, transaction){
  //     return acc + transaction.cr;
  //   }, 0);
  //   $scope.totalBalance = $scope.totalCredit - $scope.totalDebit;
  // }

});

app.controller('editModalCtrl', function($scope, $uibModalInstance, transaction, Transaction) {
  $scope.editedtransaction = angular.copy(transaction);

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

  $scope.changeTo = function(input) {
    console.log(input);
  }
})

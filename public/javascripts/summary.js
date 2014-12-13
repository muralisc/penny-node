var app = angular.module('demo', ['ui.bootstrap', 'ui.select']);

app.controller('DemoCtrl', function($scope, $http, $timeout) {

  $scope.postData = {};
  $scope.postData.query ={};
  $scope.postData.query.amount ={};
  $scope.postData.query.description = "";
  $scope.postData.skip ={};
  $scope.postData.limit ={};

  $scope.txnData; // populated in the responsePromise below
  var txnResponsePromise;
  $scope.getTransactions = function(){
    txnResponsePromise = $http.post("/get/transactions", $scope.postData);
    txnResponsePromise.success(function(data, status, headers, config) {
      $scope.txnData = data;
      console.log(data);
    });
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  $scope.getTransactions();
});

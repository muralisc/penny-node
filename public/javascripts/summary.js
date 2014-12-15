var app = angular.module('demo', ['ui.bootstrap', 'ui.select']);

app.controller('DemoCtrl', function($scope, $http, $timeout) {

  $scope.txnGetPostData = {};
  $scope.txnGetPostData.query ={};
  $scope.txnGetPostData.query.amount ={};
  $scope.txnGetPostData.query.amount.$gte =0;
  $scope.txnGetPostData.query.description = "";
  $scope.txnGetPostData.query.date = {};
  $scope.txnGetPostData.skip ={};
  $scope.txnGetPostData.limit =10;
  $scope.openedLowerDate = false;
  $scope.openedUpperDate = false;
  $scope.txnData; // populated in the responsePromise below
  $scope.txnEditPostData = {};
  var idsObject = {};
  $scope.txnEditPostData.ids = [];
  $scope.txnEditPostData.update = {};
  var txnResponsePromise;
  $scope.avaibaleCategories = ['loading...','...'];


  // Functions ------------------ Begin
  $scope.getTransactions = function(){
    txnResponsePromise = $http.post("/get/transactions", $scope.txnGetPostData);
    txnResponsePromise.success(function(data, status, headers, config) {
      $scope.txnData = data;
      console.log(data);
    });
  };
  $scope.getBalances= function(){
    txnResponsePromise = $http.get("/get/balances", $scope.txnGetPostData);
    txnResponsePromise.success(function(data, status, headers, config) {
      $scope.balances = data;
      console.log(data);
    });
  };

  $scope.onCheck = function($event){
    if(idsObject.hasOwnProperty($event.currentTarget.getAttribute("value")))
    {
      delete idsObject[ $event.currentTarget.getAttribute("value") ];
    }
    else
    {
      idsObject[ $event.currentTarget.getAttribute("value") ] = true;
    }
    console.log(idsObject);
    console.log($event.currentTarget.getAttribute("value"));
  };

  $scope.openLowerDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedLowerDate = !$scope.openedLowerDate;
  };
  $scope.openUpperDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedUpperDate = !$scope.openedUpperDate;
  };
  $scope.onEditClick = function(){
    $scope.txnEditPostData.ids = Object.keys(idsObject);
    console.log(JSON.stringify($scope.txnEditPostData));
    txnResponsePromise = $http.post("/set/updateTxns", $scope.txnEditPostData);
    txnResponsePromise.success(function(data, status, headers, config) {
      console.log(data);
      $scope.getTransactions();
    });
  };
  // Functions ------------------ End

  $scope.getTransactions();
  $scope.getBalances();
});

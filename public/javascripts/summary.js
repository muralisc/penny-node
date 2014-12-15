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
  $scope.txnEditPostData.ids = {};
  var txnResponsePromise;
  $scope.avaibaleCategories = ['loading...','loading...'];


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
    if($scope.txnEditPostData.ids.hasOwnProperty($event.currentTarget.getAttribute("value")))
    {
      delete $scope.txnEditPostData.ids[ $event.currentTarget.getAttribute("value") ];
    }
    else
    {
      $scope.txnEditPostData.ids[ $event.currentTarget.getAttribute("value") ] = true;
    }
    console.log($scope.txnEditPostData.ids);
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
  // Functions ------------------ End

  $scope.getTransactions();
  $scope.getBalances();
});

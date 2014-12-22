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
  var fcResponsePromise;
  var tcResponsePromise;
  $scope.avaibaleCategories = ['loading...','...'];
  $scope.avaibaleToCategories = ['loading...','...'];

  // code for submit --------------------BEGIN---------------------
  $scope.newTransaction = {};
  $scope.newTransaction.description = "asd";
  $scope.newTransaction.date = new Date();

  $scope.resetInputs = function(){
    $scope.newTransaction.description = "";
    $scope.newTransaction.amount = "";
    $scope.newTransaction.fromCategory = [];
    $scope.newTransaction.toCategory = "";
  }

  $scope.onSubmit = function(){
    txnResponsePromise = $http.post("/set/transaction", $scope.newTransaction);
    console.log("sent txn set request");
    txnResponsePromise.success(function(data, status, headers, config) {
      console.log(data);
      $scope.getTransactions();
      $scope.getBalances();
      $scope.getExpenses();
      $scope.clearEditVariables();
      $scope.getFromCategories();
      $scope.getToCategories();
      $scope.resetInputs();
    });
  };
  //code for submit new txn -----------------END---------------

  $scope.clearEditVariables = function(){
    $scope.txnEditPostData.update.description = "";
    $scope.txnEditPostData.update.fromCategory= [];
    $scope.txnEditPostData.update.toCategory= [];
    $scope.selectAll = false;
    // uncheck all the checked transactions
    $scope.selectAllToggle();
  }


  // Functions ------------------ Begin
  $scope.getTransactions = function(){
    txnResponsePromise = $http.post("/get/transactions", $scope.txnGetPostData);
    txnResponsePromise.success(function(data, status, headers, config) {
      $scope.txnData = data;
      console.log(data);
    });
  };
  $scope.getBalances= function(){
    txnResponsePromise = $http.get("/get/balances", {});
    txnResponsePromise.success(function(data, status, headers, config) {
      $scope.balances = data;
      console.log(data);
    });
  };
  $scope.getExpenses= function(){
    txnResponsePromise = $http.get("/get/expenses", {});
    txnResponsePromise.success(function(data, status, headers, config) {
      $scope.expenses = data;
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
  $scope.selectAllToggle = function(){
    if( $scope.selectAll == true){
      $scope.txnData.forEach(function(txn){
        txn.checked = true;
        idsObject[txn._id] = true;
      });
    } else{
      $scope.txnData.forEach(function(txn){
        txn.checked = false;
        delete idsObject[txn._id]
      });
    }
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
  $scope.getFromCategories = function(){
    fcResponsePromise = $http.get("/get/categories");
    fcResponsePromise.success(function(data, status, headers, config) {
      $scope.avaibaleCategories = data;
    });
  }
  $scope.getToCategories = function(){
    tcResponsePromise = $http.get("/get/toCategories");
    tcResponsePromise.success(function(data, status, headers, config) {
      $scope.avaibaleToCategories = data;
    });
  }
  $scope.onEditClick = function(){
    $scope.txnEditPostData.ids = Object.keys(idsObject);
    console.log(JSON.stringify($scope.txnEditPostData));
    txnResponsePromise = $http.post("/set/updateTxns", $scope.txnEditPostData);
    txnResponsePromise.success(function(data, status, headers, config) {
      console.log(data);
      $scope.getTransactions();
      $scope.getBalances();
      $scope.getExpenses();
      $scope.clearEditVariables();
      $scope.getFromCategories();
      $scope.getToCategories();
      $scope.resetInputs();
    });
  };
  // Functions ------------------ End

  $scope.getTransactions();
  $scope.getBalances();
  $scope.getExpenses();
  $scope.getFromCategories();
  $scope.getToCategories();

});

var app = angular.module('demo', ['ui.bootstrap', 'ui.select']);

app.controller('DemoCtrl', function($scope, $http, $timeout) {

  $scope.avaibaleCategories = ['loading...','...'];
  $scope.avaibaleToCategories = ['loading...','...'];
  $scope.availableDescriptions = ['asd','wer','atds'];
  $scope.availableAmounts = [2,4,234,2345];
  $scope.transcation = {};
  $scope.transcation.description = "asd";
  $scope.transcation.date = new Date();
  var txnResponsePromise;
  var fcResponsePromise;
  var tcResponsePromise;

  $scope.resetInputs = function(){
    $scope.transcation.description = "";
    $scope.transcation.fromCategory = [];
    $scope.transcation.toCategory = "";
  }

  $scope.onSubmit = function(){
    txnResponsePromise = $http.post("/set/transaction", $scope.transcation);
    console.log("sent txn set request");
    txnResponsePromise.success(function(data, status, headers, config) {
      console.log(data);
      $scope.resetInputs();
    });
  };

  fcResponsePromise = $http.get("/get/categories");
  fcResponsePromise.success(function(data, status, headers, config) {
    $scope.avaibaleCategories = data;
  });
  tcResponsePromise = $http.get("/get/toCategories");
  tcResponsePromise.success(function(data, status, headers, config) {
    $scope.avaibaleToCategories = data;
  });

});

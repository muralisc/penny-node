var app = angular.module('demo', ['ui.bootstrap', 'ui.select']);

app.controller('DemoCtrl', function($scope, $http, $timeout) {

  $scope.avaibaleCategories = ['loading...','...'];
  $scope.availableDescriptions = ['asd','wer','atds'];
  $scope.availableAmounts = [2,4,234,2345];

  $scope.transcation = {};
  $scope.transcation.description = "asd";
  $scope.transcation.date = new Date();

  $scope.onSubmit = function(){
    var responsePromise = $http.post("/set/transaction", $scope.transcation);
    console.log("asdfA");
  };

  var responsePromise = $http.get("/get/categories");

  responsePromise.success(function(data, status, headers, config) {
    $scope.avaibaleCategories = data;
  });

});

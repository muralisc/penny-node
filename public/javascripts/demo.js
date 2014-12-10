var app = angular.module('demo', ['ui.bootstrap', 'ui.select']);

app.controller('DemoCtrl', function($scope, $http, $timeout) {

  $scope.avaibaleCategories = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
  $scope.availableDescriptions = ['asd','wer','atds'];
  $scope.availableAmounts = [2,4,234,2345];

  $scope.transcation = {};
  $scope.transcation.description = "asd";
  $scope.transcation.date = new Date();

  $scope.onSubmit = function(){
    var responsePromise = $http.post("/categories", $scope.transcation);
  };

  var responsePromise = $http.get("/categories");

  responsePromise.success(function(data, status, headers, config) {
    console.log(data['title']);
    $scope.avaibaleCategories = data['title'];
  });

});

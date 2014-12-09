var app = angular.module('demo', ['ui.bootstrap', 'ui.select']);

app.controller('DemoCtrl', function($scope, $http, $timeout) {

  $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];

  $scope.multipleDemo = {};
  // $scope.multipleDemo.colors2 = ['Blue','Red'];
  var responsePromise = $http.get("/categories");

  responsePromise.success(function(data, status, headers, config) {
    console.log(data['title']);
    $scope.availableColors = data['title'];
  });

});

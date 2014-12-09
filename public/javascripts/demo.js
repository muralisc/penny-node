var app = angular.module('demo', ['ngSanitize', 'ui.select']);

app.controller('DemoCtrl', function($scope, $http, $timeout) {

  $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];

  $scope.multipleDemo = {};
  // $scope.multipleDemo.colors2 = ['Blue','Red'];

});

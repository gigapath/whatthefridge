angular.module('wtf.dashboard', [])
  .controller('DashboardController', function($scope, $window, Auth, Recipe) {

    $scope.deleteRecipe = function(){};
    $scope.goShopping = function(){};
    $scope.getAllRecipes = function(){}

    $scope.getAllRecipes();
  });
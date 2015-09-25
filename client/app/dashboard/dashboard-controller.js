angular.module('wtf.dashboard', [])
  .controller('DashboardController', function($scope, $window) {
    //assuming a getrequest was done and data is now available
    
    $scope.allRecipes = [
        {id: 1, title: "Mom's Lasagna", ingredients: ["tomatoes", "ricotta cheese", "italian sausage"]},
        {id: 2, title: "Mac&Cheese", ingredients: ["macaroni", "cheese", "milk", "salt", "pepper"]},
        {id: 3, title: "Chocolate chip cookies", ingredients: ["chocolate", "flour", "salt", "pepper"]}
    ];

    $scope.deleteRecipe = function(){};
    $scope.goShopping = function(){};
    $scope.getAllRecipes = function(){
    }

    $scope.getAllRecipes();
  });
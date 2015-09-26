angular.module('wtf.shopping-list', [])
  .controller('ShoppingListController', function($scope, $window) {

    $scope.shoppingList = [{name:"tomatoes"}, {name:"cheese"}, {name:"noodles"}];


  });
angular.module('wtf.create-recipes', [])
  .controller('CreateRecipesController', function($scope, $window, $location, Recipes) {

    $scope.recipe = {ingredients: []};

    $scope.addIngredient = function() {
        $scope.recipe.ingredients.push($scope.newIngredient);
        $scope.newIngredient = "";
    };

    $scope.removeIngredient = function(ingredient) {
        $scope.recipe.ingredients.splice($scope.recipe.ingredients.indexOf(ingredient), 1);
    };

    $scope.saveRecipe = function() {
        Recipes.createRecipe($scope.recipe)
          .then(function(){
            $location.path("/dashboard");
          });
    };

    // $scope.$watch(Auth.isAuth, function(authed) {
    //   if (authed) {
    //     $location.path('/create-recipes');
    //   } else {
    //     $location.path('/');
    //   }
    // }, true);

    // $scope.submit = function(ingredient) {
    //   Recipe.createRecipe(recipe).then(function(data, err) {
    //     if (err) console.log(err);
    //     $scope.getData();
    //     $scope.recipe = {};
    //   });
    });
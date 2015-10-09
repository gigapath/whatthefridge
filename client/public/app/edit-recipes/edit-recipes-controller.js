angular.module('wtf.edit-recipes', [])
  .controller('EditRecipesController', ["$scope", "$window", "$location", "currentRecipeService", "Recipes", function($scope, $window, $location, currentRecipeService, Recipes){

    //local variable storing new and existing recipe values
    //prepopulate ingredients array with the existing values
    $scope.recipe = {ingredients: [], remove: []};
    $scope.currentRecipe = currentRecipeService.getRecipeToEdit();

    //push existing ingredients into scope.recipe for initial rendering
    for(var i=0; i<$scope.currentRecipe.ingredients.length; i++) {
      $scope.recipe.ingredients.push($scope.currentRecipe.ingredients[i]);
    }

    //render the existing recipe title and assign id
    $scope.recipe.name = $scope.currentRecipe.title;
    $scope.recipe.id = $scope.currentRecipe.id;
    
    //add a new ingredients
    $scope.addIngredient = function() {
      $scope.recipe.ingredients.push($scope.newIngredient);
      $scope.newIngredient = "";
    };

    //remove an ingredient
    $scope.removeIngredient = function(ingredient) {
      $scope.recipe.ingredients.splice($scope.recipe.ingredients.indexOf(ingredient), 1);
    };

    //save recipe to database and redirect to dashboard
    $scope.saveRecipe = function() {
    // use diffing to remove ingredients from database for the recipe
      for(var i=0; i<$scope.currentRecipe.ingredients.length; i++) {
        //if old ingredients not found in the current ingredients array
        if( $scope.recipe.ingredients.indexOf($scope.currentRecipe.ingredients[i]) < 0 ) {
          $scope.recipe.remove.push($scope.currentRecipe.ingredients[i]);
        }
      }

      Recipes.editRecipe($scope.recipe)
        .then(function(){
          $location.path("/recipes");
        });
    };

  }]);

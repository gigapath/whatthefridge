angular.module('wtf.recipes', ['checklist-model'])
  .controller('RecipesController', ["$scope", "$window", "$location", "currentRecipeService", "Recipes", function($scope, $window, $location, currentRecipeService, Recipes) {

    $scope.populate=function(){
      var recipe = {
        name: "My First Recipe",
        ingredients: [
          "tomatoes",
          "ground beef",
          "cheese",
          "green onions"
        ],
      };
      Recipes.createRecipe(recipe)
        .then(function(){
          Recipes.getRecipes()
        })
        .then(function(){
          window.location.reload();
          alert('We\'ve added your first recipe!  Click this button again for our tour!')
        })
    };

    $scope.getAllRecipes = function() {
      Recipes.getRecipes()
      .success(function(data){
        $scope.allRecipes = data;
        $scope.suggestRecipe($scope.allRecipes);
      })
      .catch(function(err){
        console.log(err);
      })
    };

    //this is run from the recipes html, on clicking a specific recipe
    $scope.getCurrentRecipe = function(currentRecipe) {
      $scope.currentRecipe = currentRecipe;
      //add to services variable to share with other ingredients
      currentRecipeService.addRecipeToEdit(currentRecipe);
      $location.path('/edit-recipes');
    };

    $scope.recipes  = {
      selected: Recipes.selectedRecipes
    };

    // $scope.$watch(Auth.isAuth, function(authed) {
    //   if (authed) {
    //     $location.path('/create-recipes');
    //   } else {
    //     $location.path('/');
    //   }
    // }, true);

    $scope.getShoppingList = function() {
      $("#shopCheck").closeModal();
      $location.path('create-list');
    };

    $scope.deleteModal = function(recipe){
      $scope.deleteRecipe = recipe;
      $("#deleteCheck").openModal();
    };

    $scope.delete = function(recipe){
      Recipes.deleteRecipe(recipe)
      .success(function(data){
        $scope.getAllRecipes();
      })
    };

    $scope.suggestRecipe = function(allRecipes){
      Recipes.suggestRecipes(allRecipes)
      .success(function(data){
        $scope.suggestedRecipe = data;
      })
      .catch(function(err){
        console.log(err);
      })
    };

    $scope.addSuggestedRecipe = function(suggestedRecipe){
      Recipes.addSuggestedRecipe(suggestedRecipe)
      .success(function(data){
        $scope.getAllRecipes();
      })
      .catch(function(err){
        console.log(err, " error in client controller");
      })
    };

    $scope.getInstructions = function(recipeId){
      Recipes.idForInstructions = recipeId;
      $location.path('instructions');
    };

    $scope.getAllRecipes();
  }]);

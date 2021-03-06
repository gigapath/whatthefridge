/* database models
exports model methods along with the connection object
getRecipes - to refresh the /recipes page and render all recipes for a particular user
createRecipe - to add a new recipe to the user's collection
editRecipe - to edit an existing recipe from the user's collection
addRecipeMapping - add to the mapping table, representing the many to many relationship b/w recipes and ingredients
removeRecipeMapping - remove ingredient mapping for an edited recipe
getRecipeMapping - check if a mapping exist before saving edited recipes
*/
module.exports = function(knex) {
    return {
      //fetch all recipes for a specific user. call user model method.
      getAllRecipes: function(userId) {
        return knex
          .select(['recipes.id', 'recipes.title', 'ingredients.name', 'ingredients.price', 'recipes.instructions'])
          .from('recipes')
          .leftJoin('recipes_ingredients', 'recipes.id', 'recipes_ingredients.recipe_id')
          .leftJoin('ingredients', 'recipes_ingredients.ingredient_id', 'ingredients.id')
          .where({
            'recipes.user_id': userId
          })
          .orderBy('recipes.id')
      },
      deleteRecipe: function(recipeId){
        return knex
        .select('*')
        .from('recipes_ingredients')
        .where({
          'recipe_id': recipeId
        })
        .del()
        .then(function(){
          return knex
          .select('*')
          .from('shopping_lists_recipes')
          .where({
            'recipe_id': recipeId
          })
          .del()
        })
        .then(function(){
          return knex
          .select('*')
          .from('recipes')
          .where({
            'id': recipeId
          })
          .del()
        })
      },
      getRecipe: function(recipeId) {
        return knex
        .select(['recipes.title', 'ingredients.name', 'recipes.instructions'])
        .from('recipes')
        .leftJoin('recipes_ingredients', 'recipes.id', 'recipes_ingredients.recipe_id')
        .leftJoin('ingredients', 'recipes_ingredients.ingredient_id', 'ingredients.id')
        .where({
          'recipes.id': recipeId
        })
      },
      createRecipe: function(title, userId, instructions) {
        return knex('recipes')
          .returning('id')
          .insert({
            'title': title,
            'user_id': userId,
            'instructions':instructions
          })
      },
      //only title is updated in the recipe table    
      editRecipe: function(recipeId, title) {
        return knex('recipes')
          .where('id', '=', recipeId)
          .update({
            'title': title
          })
      },
      //adds foreign keys to the recipe-ingredient map table
      addRecipeMapping: function(recipeId, ingredientId) {
        return knex('recipes_ingredients')
          .insert({
            'recipe_id': recipeId,
            'ingredient_id': ingredientId
          })
      },
      removeRecipeMapping: function(recipeId, ingredientId) {
        return knex('recipes_ingredients')
          .where('recipe_id', '=', recipeId)
          .andWhere('ingredient_id', '=', ingredientId)
          .del()
      },
      getRecipeMapping: function(recipeId, ingredientId) {
        return knex
          .select('*')
          .from('recipes_ingredients')
          .where('recipe_id', '=', recipeId)
          .andWhere('ingredient_id', '=', ingredientId)
      },
      getAllOtherUserRecipes: function(userId){
        return knex
          .select(['recipes.id', 'recipes.title', 'recipes.user_id'])
          .from('recipes')
          .whereNot({'recipes.user_id':userId})
      },
      getRecipeByTitle: function(userId, title){
        return knex
          .select()
          .from('recipes')
          .leftJoin('recipes_ingredients', 'recipes.id', 'recipes_ingredients.recipe_id')
          .leftJoin('ingredients', 'recipes_ingredients.ingredient_id', 'ingredients.id')
          .where({'recipes.title':title, 'recipes.user_id':userId})
      },
      editInstructions: function(recipeId, instructions) {
        return knex('recipes')
          .where('id', '=', recipeId)
          .update({
            'instructions': instructions
          })
      }
    }
}


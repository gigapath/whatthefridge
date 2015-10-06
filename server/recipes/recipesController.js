
module.exports = function(Recipes, Ingredients) {
  return {
    createRecipe: function(req, res) {
      var recipeName = req.body.name;
      var ingredients = req.body.ingredients;
      // Create the recipe in the recipes table
      Recipes.createRecipe(recipeName, req.user.id).then(function(id) {

        var recipeID = id[0];

        // Get ingredient IDs that already exist, or add new Ingredients.
        // After ingredient is added, map it to the recipe.
        for (var i = 0; i < ingredients.length; i++) {

          // Tricky way to pass i into promise scope
          (function(i) {
            Ingredients.getIngredientByName(req.user.id, ingredients[i]).then(function(row){
              if (row.length) {
                Recipes.addRecipeMapping(recipeID, row[0].id).then(function(){});
              }
              else {
                Ingredients.addIngredient(req.user.id, ingredients[i]).then(function(id) {
                  Recipes.addRecipeMapping(recipeID, id[0]).then(function(){});
                })
              }
            })
          })(i);

        }
      });

      res.sendStatus(200);
    },
    /* NOTE FOR BELOW FUNCTION
    PostgreSQL returns decimal/numeric datatypes as strings. This is because PostgreSQL can handle
    much much larger numbers than JavaScript, so the PG that interacts with Node converts numeric (not integer)
    into a string so that precision is not lost. To get around this, we have to parseFloat the price field to
    convert it back into a number.
    */
    getRecipes: function(req, res) {
       Recipes.getAllRecipes(req.user.id)
        .then(function(data){
          var recipeResult = [];
          var currentRecipe = Infinity;
          var recipeObjCount = -1;
          for (var i=0; i<data.length; i++) {
            //if the data being read is for the same recipe, push to the ingredient 
            if (currentRecipe === data[i].id) {
              recipeResult[recipeObjCount]["ingredients"].push(data[i].name);
              recipeResult[recipeObjCount]["price"] = recipeResult[recipeObjCount]["price"] + parseFloat(data[i].price);
            } else { //if the data is for a new recipe, create object and push the ingredient
              recipeObjCount++;
              recipeResult.push({id: data[i].id, title: data[i].title, ingredients: [], price:0});
              recipeResult[recipeObjCount]["ingredients"].push(data[i].name);
              recipeResult[recipeObjCount]["price"] = recipeResult[recipeObjCount]["price"] + parseFloat(data[i].price);
              currentRecipe = data[i].id;
            }             
          }
          res.send(recipeResult);
        })
        // res.sendStatus(200);
    },
    // editRecipe: function(req, res) {
    //   var recipeID = req.body.id;
    //   var recipeName = req.body.name;
    //   var ingredients = req.body.ingredients;
    //   var removeIngredients = req.body.remove;

    //   // Get ingredient IDs that already exist for the user, or add new Ingredients.
    //   // After ingredient is added, map it to the recipe, if the mapping doesn't already exist
    //   for (var i = 0; i < ingredients.length; i++) {

    //     (function(i) {
    //       Ingredients.getIngredientByName(req.user.id, ingredients[i]).then(function(row){
    //         if (row.length) {
    //           Recipes.getRecipeMapping(recipeID, row[0].id).then(function(mapRow){
    //             //if mapping doesn't already exist
    //             if (!mapRow.length) {
    //               Recipes.addRecipeMapping(recipeID, row[0].id).then(function(){});
    //             }
    //           })
    //         }
    //         else {
    //           Ingredients.addIngredient(req.user.id, ingredients[i]).then(function(id) {
    //             Recipes.addRecipeMapping(recipeID, id[0]).then(function(){});
    //           })
    //         }
    //       })
    //     })(i);
    //   }

    //   //Remove ingredients from recipe mapping table.
    //   for (var j = 0; j < removeIngredients.length; j++) {
    //     (function(i) {
    //       Ingredients.getIngredientByName(req.user.id, removeIngredients[j]).then(function(row){
    //         Recipes.removeRecipeMapping(recipeID, row[0].id).then(function(){});
    //       }).then(function(){})

    //     })(i);
    //   }
    //   //update recipe name
    //   Recipes.editRecipe(recipeID, recipeName).then(function(){});

    //   res.sendStatus(200);
    // },

    editRecipe: function(req, res) {
      var recipeID = req.body.id;
      var recipeName = req.body.name;
      var ingredients = req.body.ingredients;
      var removeIngredients = req.body.remove;

      // Get ingredient IDs that already exist for the user, or add new Ingredients.
      // After ingredient is added, map it to the recipe, if the mapping doesn't already exist
      var promisesAddIngredients = ingredients.map(function(ingredient) {
          return Ingredients.getIngredientByName(req.user.id, ingredient)
            .then(function(row){
              if (row.length) {
                return Recipes.getRecipeMapping(recipeID, row[0].id)
                  .then(function(mapRow){
                  //if mapping doesn't already exist
                    if (!mapRow.length) {
                      return Recipes.addRecipeMapping(recipeID, row[0].id)
                        .then(function(){});
                    }
                  })
              }
              else {
                return Ingredients.addIngredient(req.user.id, ingredient)
                  .then(function(id) {
                    return Recipes.addRecipeMapping(recipeID, id[0])
                      .then(function(){});
                })
              }
            })
            .catch(function(err){
              console.log("error in edit recipes, add ingredients ", err);//write to error log file instead
            })
          })

      //Remove ingredients from recipe mapping table.
      var promisesRemoveIngredients = removeIngredients.map(function(ingredient){
        return Ingredients.getIngredientByName(req.user.id, removeIngredient)
          .then(function(row){
            return Recipes.removeRecipeMapping(recipeID, row[0].id)
              .then(function(){});
          })
          .catch(function(err){
            console.log("error in edit recipes, remove ingredients ", err);
          })        
      })

      //update recipe name
      var promisesRecipeTitle = Recipes.editRecipe(recipeID, recipeName)
        .catch(function(err){
          console.log("error in edit recipes, update title ", err);
        })

      return Promise.all([promisesAddIngredients, promisesRemoveIngredients, promisesRecipeTitle])
      .then(function(data){
        res.sendStatus(200);
      })     
      } 
    ,

    deleteRecipe: function(req, res){
      Recipes.deleteRecipe(req.body.id)
        .then(function(data){
          res.json("deleted " + req.body.title);
        })
    }
  } 
}


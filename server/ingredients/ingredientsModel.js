/* database models
exports model methods along with the connection object
addIngredients - add a new ingredient
*/
module.exports = function(knex) {
    return {
      getIngredientById: function(ingredientId) {
        return knex
          .select('*')
          .from('ingredients')
          .where({
            'id': ingredientId
          })
      },
      getIngredientByName: function(name) {
        return knex('ingredients').select()
                 .where({'name': name});
      },
      //for a new recipe, add ingredients sent by the recipes model
      addIngredient: function(name, price) {
        //version 1: receiving one ingredient at a time
        var price = price || 0;
        return knex('ingredients')
          .returning('id')
          .insert({
            'name': name,
            'price': price
          });
        //version 2: receiving multiple arguments and sending one promise back
        //var slicedIng = Array.prototype.slice.call(arguments, 1);
      }
    }
}

module.exports = function(app, ShoppingLists, Ingredients) {
  // shopping list routes go here
  var shoppingListsController = require('./shoppingListsController')(ShoppingLists, Ingredients);

  app.get('/getLists', shoppingListsController.getLists);
  app.post('/saveList', shoppingListsController.saveList);
}
// Bulk insert - Recipes
var recipes = {
  RequestItems: {
    Recipe: [
      {
        PutRequest: {
          Item: {
            Cookbook: 'Everyday Italian',
            Name: 'Classic Italian Lasagna',
            Page: 75,
            Image: 'lasagna.jpg',
            Comments: [
              'Tip: Make the marinara and béchamel sauces (recipes also in book) ahead of time.',
              'Make sure the squeeze out all the water from the frozen spinach or the lasagna might be too runny.',
              'Great for leftovers!'
            ],
            RecipeId: 1,
            UserId: 1
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Cookbook: 'Everyday Italian',
            Name: 'Lemon Ricotta Cookies',
            Url: 'http://www.foodnetwork.com/recipes/giada-de-laurentiis/lemon-ricotta-cookies-with-lemon-glaze-recipe.html',
            RecipeId: 2,
            UserId: 2
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Cookbook: 'Skinnytaste',
            Name: 'Super Moist Carrot Cake with Cream Cheese Frosting',
            Url: 'http://www.skinnytaste.com/super-moist-carrot-cake-with-cream/',
            Image: 'cupcakes.jpg',
            Comments: [
              'Instead of making a cake, I made cupcakes.'
            ],
            RecipeId: 3,
            UserId: 1
          }
        }
      },
    ],
    // ... more tables ...
  },
  ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
  ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};
docClient.batchWrite(recipes, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

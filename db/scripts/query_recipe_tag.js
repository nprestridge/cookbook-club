/* Get whole RecipeTag table */
var allRecipeTags = {
  TableName: 'RecipeTag'
};

dynamodb.scan(allRecipeTags, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

/* Get all recipes by tag */
var recipesByTag = {
  TableName : "RecipeTag",
  KeyConditionExpression: "Tag = :tag",
  ExpressionAttributeValues: {
    ":tag": "ricotta",
  }
};

docClient.query(recipesByTag, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

/* Get all tags by recipe */
var recipeTags = {
  TableName : "RecipeTag",
  IndexName: "CookbookRecipeIndex",
  KeyConditionExpression: "CookbookRecipe = :id",
  ExpressionAttributeValues: {
    ":id": "EverydayItalian-LemonRicottaCookies"
  },
};

docClient.query(recipeTags, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

/* Get whole Recipe table */
var allRecipes = {
  TableName: 'Recipe'
};

dynamodb.scan(allRecipes, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

/* Get a recipe */
var getRecipe = {
  TableName: 'Recipe',
  Key: { // a map of attribute name to AttributeValue for all primary key attributes
    Name: 'Classic Italian Lasagna',
    Cookbook: 'Everyday Italian', //(string | number | boolean | null | Binary)
  }
};

docClient.get(getRecipe, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

/* Get all recipes by cookbook */
var recipesByCookbook = {
  TableName : "Recipe",
  KeyConditionExpression: "Cookbook = :cookbook",
  ExpressionAttributeValues: {
    ":cookbook":"Everyday Italian",
  }
};

docClient.query(recipesByCookbook, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

/* Get all recipes by user */
var recipesByUser = {
  TableName: "Recipe",
  IndexName: "UserIndex",
  KeyConditionExpression: "UserId = :id",
  ExpressionAttributeValues: {
    ":id": 1
  },
}

docClient.query(recipesByUser, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

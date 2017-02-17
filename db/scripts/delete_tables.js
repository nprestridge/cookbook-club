var deleteCookbook = {
    TableName: 'Cookbook',
};
dynamodb.deleteTable(deleteCookbook, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

var deleteRecipe = {
    TableName: 'Recipe',
};
dynamodb.deleteTable(deleteRecipe, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

var deleteRecipeTag = {
    TableName: 'RecipeTag',
};
dynamodb.deleteTable(deleteRecipeTag, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

var deleteUser = {
    TableName: 'User',
};
dynamodb.deleteTable(deleteUser, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

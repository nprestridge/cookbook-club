'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

function queryDynamoPromise(params) {
  return new Promise((resolve, reject) => {
    dynamo.query(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

function fetchRecipes(arr) {
  var promises = arr.map(function(item) {
    //  console.log("item.CookbookRecipe: ", item.CookbookRecipe);
    const recipeQuery = {
      TableName : "Recipe",
      IndexName: "CookbookRecipeIndex",
      KeyConditionExpression: "CookbookRecipe = :id",
      ExpressionAttributeValues: {
        ":id": item.CookbookRecipe
      },
    };

    return queryDynamoPromise(recipeQuery).then(function(recipes) {
      if (recipes && recipes.Items) {
        let recipeItem = recipes.Items[0];
        item.Recipe = recipeItem.Name;
        item.Cookbook = recipeItem.Cookbook;
      }

      return item;
    }).catch(function(err) {
      console.log(err);
    });
  });

  return Promise.all(promises);
}

/**
* Get all recipes by tag in DynamoDB
*
* Provide an event that contains the following keys:
*   - tag
*/
exports.handler = (event, context, callback) => {
  const tag = event.tag;

  // Check required fields are entered
  let validationError = '';
  if (!tag) {
    validationError += 'Select a tag \n';
  }

  if (validationError) {
    callback (validationError);
  }

  const payload = {
    TableName : "RecipeTag",
    KeyConditionExpression: "Tag = :tag",
    ExpressionAttributeValues: {
      ":tag": tag,
    }
  };

  // get recipes matching tag
  dynamo.query(payload, function (err, data) {
    if (err) {
      callback(err);
    }

    let response = [];
    const items = (data && data.Items) ? data.Items : [];

    // format JSON
    items.forEach(function (element) {
      const formattedResult = {
        CookbookRecipe: element.CookbookRecipe,
      };

      response.push(formattedResult);
    });

    fetchRecipes(response).then(function(results) {
      callback(null, results);
    });
  });
};

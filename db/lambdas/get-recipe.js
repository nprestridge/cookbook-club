'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

function getItemDynamoPromise(params) {
  return new Promise((resolve, reject) => {
    dynamo.getItem(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

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

/**
* Get recipe by cookbook and name in DynamoDB
*
* Provide an event that contains the following keys:
*   - cookbook
*   - name
*/
exports.handler = (event, context, callback) => {
  const cookbook = event.cookbook;
  const name = event.name

  // Check required fields are entered
  let validationError = '';
  if (!cookbook) {
    validationError += 'Enter a Cookbook \n';
  }

  if (!name) {
    validationError += 'Enter a Recipe Name \n';
  }

  if (validationError) {
    callback (validationError);
  }

  const payload = {
    TableName: 'Recipe',
    Key: {
      Name: name,
      Cookbook: cookbook,
    }
  };

  getItemDynamoPromise(payload).then(function(recipe) {

    let response = {};

    if (recipe.Item) {
      const recipeItem = recipe.Item;
      response = {
        cookbook: recipeItem.Cookbook,
        name: recipeItem.Name,
        page: recipeItem.Page,
        link: recipeItem.Link
      };

      // get tags
      const tagQuery = {
        TableName : "RecipeTag",
        IndexName: "CookbookRecipeIndex",
        KeyConditionExpression: "CookbookRecipe = :id",
        ExpressionAttributeValues: {
          ":id": recipeItem.Cookbook.replace(/\s+/g, '') + '-' + recipeItem.Name.replace(/\s+/g, '')
        },
      };

      queryDynamoPromise(tagQuery).then(function(tags) {
        // add tags to response
        if (tags && tags.Items) {
          let recipeTags = [];

          tags.Items.forEach(function (element) {
            recipeTags.push(element.Tag);
          });

          response.tags = recipeTags;
        }

        // get user/cook
        const userQuery = {
          TableName: 'User',
          Key: {
            Email: recipeItem.UserEmail
          }
        };

        getItemDynamoPromise(userQuery).then(function(user) {
          if (user.Item) {
            response.cook = user.Item.FirstName;
          }

          callback(null, response);
        }); // end user query

      }); // end tag query

    }  // end if

  }).catch(function(err) {
    callback(err);
  });
};

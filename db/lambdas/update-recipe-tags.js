'use strict'

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

/**
* Update a recipe's tags.  This will delete existing tags and replace them with the tags passed in.
*
* Provide an event that contains the following keys:
*   - cookbookRecipe: Cookbook-Recipe key
*   - tags: Array of string containing recipe tags
*/
exports.handler = (event, context, callback) => {
  const cookbookRecipe = event.cookbookRecipe;
  const tags = event.tags ? event.tags : [];

  // Check required fields are entered
  let validationError = '';
  if (!cookbookRecipe) {
    validationError += 'Select a recipe \n';
  }

  if (tags && tags.length > 25) {
    validationError += 'Only a max of 25 tags can be entered per recipe \n';
  }

  if (validationError) {
    callback (validationError);
  }

  var payload = {
    RequestItems: {
      RecipeTag: [
      ]
    }
  };

  /* Get all tags by recipe */
  var recipeTags = {
    TableName : "RecipeTag",
    IndexName: "CookbookRecipeIndex",
    KeyConditionExpression: "CookbookRecipe = :id",
    ExpressionAttributeValues: {
      ":id": cookbookRecipe
    },
  };

  docClient.query(recipeTags, function(err, data) {
    // Delete existing tags
    if (data.Items) {
      let currentTags = data.Items;
      currentTags.forEach(function (recipeTag) {
        let item = {
          DeleteRequest: {
            Key: {
              Tag: recipeTag.Tag,
              CookbookRecipe: recipeTag.CookbookRecipe
            }
          }
        };

        payload.RequestItems.RecipeTag.push(item);
      });

      docClient.batchWrite(payload, callback);
      payload.RequestItems.RecipeTag = [];  // reset for insert
    }

    // Add new tags
    tags.forEach(function (tag) {
      let item = {
        PutRequest: {
          Item: {
            CookbookRecipe: cookbookRecipe,
            Tag: tag
          }
        }
      };

      payload.RequestItems.RecipeTag.push(item);
    });

    docClient.batchWrite(payload, callback);
 });

}

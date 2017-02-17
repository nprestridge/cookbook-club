'use strict'

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

/**
* Delete a cookbook
*
* Provide an event that contains the following keys:
*   - title
*   - author
*/
exports.handler = (event, context, callback) => {
  const title = decodeURI(event.params.path.title);
  const author = decodeURI(event.params.path.author);

  // Check required fields are entered
  let validationError = '';
  if (!title) {
    validationError += 'Select a title \n';
  }

  if (!author) {
    validationError += 'Select an author \n';
  }

  if (validationError) {
    callback (validationError);
  }

  // Only delete cookbook if there are no recipes associated
  const recipes = {
    TableName: 'Recipe',
    KeyConditionExpression: 'Cookbook = :cookbook',
    ExpressionAttributeValues: {
      ':cookbook': title,
    }
  };

  queryDynamoPromise(recipes).then(function(data) {
    if (data && data.Items && data.Items.length > 0) {
      // Do not delete cookbook
      callback ('Cookbook has recipes which cannot be deleted.');
    }
    else {
      // Delete item
      const payload = {
        TableName: 'Cookbook',
        Key: {
          Title: title,
          Author: author
        }
      };

      dynamo.deleteItem(payload, callback);
    }
  }).catch(function(err) {
    callback(err);
  });

}

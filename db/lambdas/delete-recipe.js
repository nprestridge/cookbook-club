'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Delete a recipe
*
* Provide an event that contains the following keys:
*   - cookbook
*   - name
*/
exports.handler = (event, context, callback) => {
  const cookbook = event.cookbook;
  const name = event.name;

  // Check required fields are entered
  let validationError = '';
  if (!cookbook) {
    validationError += 'Select a cookbook \n';
  }

  if (!name) {
    validationError += 'Select a name \n';
  }

  if (validationError) {
    callback (validationError);
  }

  // Delete item
  const payload = {
    TableName: 'Recipe',
    Key: {
      Cookbook: cookbook,
      Name: name
    }
  };

  dynamo.deleteItem(payload, callback);
}

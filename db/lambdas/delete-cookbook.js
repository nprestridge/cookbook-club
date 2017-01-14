'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Delete a cookbook
*
* Provide an event that contains the following keys:
*   - title
*   - author
*/
exports.handler = (event, context, callback) => {
  const title = event.title;
  const author = event.author;

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

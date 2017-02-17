'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Create a user
*
* Provide an event that contains the following keys:
*   - email: User's email
*   - (optional) firstName
*/
exports.handler = (event, context, callback) => {
  const email = event.email;
  const firstName = event.firstName;

  // Check required fields are entered
  let validationError = '';
  if (!email) {
    validationError += 'Enter an e-mail \n';
  }

  if (validationError) {
    callback (validationError);
  }

  // Insert item
  const item = {
    Email: email
  };

  if (firstName) {
    item.FirstName = firstName;
  }

  const payload = {
    TableName: 'User',
    Item: item
  };

  dynamo.putItem(payload, callback);
}

'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Get a user by e-mail
*
* Provide an event that contains the following keys:
*   - email
*/
exports.handler = (event, context, callback) => {
  const email = event.email;

  // Check required fields are entered
  let validationError = '';
  if (!email) {
    validationError += 'Enter an email \n';
  }

  if (validationError) {
    callback (validationError);
  }

  // Get item
  const payload = {
    TableName: 'User',
    Key: {
      Email: email
    }
  };

  // get user
  dynamo.getItem(payload, function (err, data) {
    if (err) {
      callback(err);
    }

    let response = {};

    if (data.Item) {
      const item = data.Item;
      response = {
        email: item.Email
      };

      if (item.FirstName) {
        response.firstName = item.FirstName;
      }
    }

    callback(null, response);
  });
}

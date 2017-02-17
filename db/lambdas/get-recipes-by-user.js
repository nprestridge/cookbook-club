'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Get all recipes by user in DynamoDB
*
* Provide an event that contains the following keys:
*   - user email
*/
exports.handler = (event, context, callback) => {
  const email = event.userEmail;

  // Check required fields are entered
  let validationError = '';
  if (!email) {
    validationError += 'Select as user \n';
  }

  if (validationError) {
    callback (validationError);
  }

  const payload = {
    TableName: 'Recipe',
    IndexName: "UserEmailIndex",
    KeyConditionExpression: 'UserEmail = :email',
    ExpressionAttributeValues: {
      ':email': email,
    }
  };

  // get recipes for user
  dynamo.query(payload, function (err, data) {
    if (err) {
      callback(err);
    }

    let response = [];
    const items = (data && data.Items) ? data.Items : [];

    // format JSON
    items.forEach(function (element) {
      const formattedResult = {
        cookbook: element.Cookbook,
        name: element.Name,
        page: element.Page,
        link: element.Link
      };

      response.push(formattedResult);
    });

    callback(null, response);
  });
};

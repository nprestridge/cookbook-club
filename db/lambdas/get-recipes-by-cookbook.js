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

// Create a user map of key (email) -> user data
function getUserMapPromise() {
  const payload = {
    TableName: 'User'
  };

  return new Promise((resolve, reject) => {
    dynamo.scan(payload, (err, data) => {
      if (err) {
        return reject(err);
      }

      let map = {};
      const items = (data && data.Items) ? data.Items : [];
      items.forEach(function (element) {
        map[element.Email] = element;
      });

      return resolve(map);
    });
  });
}

/**
* Get all recipes by cookbook name in DynamoDB
*
* Provide an event that contains the following keys:
*   - cookbook
*/
exports.handler = (event, context, callback) => {
  const cookbook = event.cookbook;

  // Check required fields are entered
  let validationError = '';
  if (!cookbook) {
    validationError += 'Select a Cookbook \n';
  }

  if (validationError) {
    callback (validationError);
  }

  const payload = {
    TableName: 'Recipe',
    KeyConditionExpression: 'Cookbook = :cookbook',
    ExpressionAttributeValues: {
      ':cookbook': cookbook,
    }
  };

  getUserMapPromise().then(function(users) {
    queryDynamoPromise(payload).then(function(data) {
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

        // Add user info
        if (users[element.UserEmail]) {
          formattedResult.cook = users[element.UserEmail].FirstName;
        }

        response.push(formattedResult);
      });

      callback(null, response);
    }).catch(function(err) {
      callback(err);
    });
  });
};

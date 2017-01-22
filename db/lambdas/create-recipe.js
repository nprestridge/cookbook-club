'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Create a recipe
*
* Provide an event that contains the following keys:
*   - cookbook: Cookbook name or Blog site
*   - name:  Recipe name
    - userEmail:  Cook
    - link (optional):  Link to recipe
    - page (optional): Recipe page
*/
exports.handler = (event, context, callback) => {
  const cookbook = event.cookbook;
  const name = event.name;
  const userEmail = event.userEmail;
  const link = event.link;
  const page = event.page;

  // Check required fields are entered
  let validationError = '';
  if (!cookbook) {
    validationError += 'Enter a cookbook \n';
  }

  if (!name) {
    validationError += 'Enter a recipe name \n';
  }

  if (!userEmail) {
    validationError += 'Enter an user \n';
  }

  if (validationError) {
    callback (validationError);
  }

  // Insert item
  const item = {
    Cookbook: cookbook,
    Name: name,
    UserEmail: userEmail
  };

  if (link) {
    item.Link = link;
  }

  if (page) {
    item.Page = page;
  }

  const payload = {
    TableName: 'Recipe',
    Item: item
  };

  dynamo.putItem(payload, callback);
}

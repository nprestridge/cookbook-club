'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Create a cookbook
*
* Provide an event that contains the following keys:
*   - title: Cookbook name or Blog site
*   - author
*   - (optional) meetingDate in ISO format (YYYY-MM-DD)
*   - (optionel) blog
*/
exports.handler = (event, context, callback) => {
  const title = event.title;
  const author = event.author;
  const meetingDate = event.meetingDate
  const blog = event.blog;

  // Check required fields are entered
  let validationError = '';
  if (!title) {
    validationError += 'Enter a title \n';
  }

  if (!author) {
    validationError += 'Enter an author \n';
  }

  if (validationError) {
    callback (validationError);
  }

  // Insert item
  const item = {
    Title: title,
    Author: author
  };

  if (meetingDate) {
    item.MeetingDate = meetingDate;
  }

  if (blog) {
    item.Blog = blog;
  }

  const payload = {
    TableName: 'Cookbook',
    Item: item
  };

  dynamo.putItem(payload, callback);
}

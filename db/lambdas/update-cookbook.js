'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Update a cookbook
*
* Provide an event that contains the following keys:
*   - title: Cookbook name or Blog site
*   - author
*   - (optional) meetingDate in ISO format (YYYY-MM-DD)
*   - (optional) url
*/
exports.handler = (event, context, callback) => {
  // TODO - Allow image upload
  const title = event.title;
  const author = event.author;
  const meetingDate = event.meetingDate
  const url = event.blog;

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

  // Update item
  // http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.Modifying.html
  const payload = {
    TableName: 'Cookbook',
    Key: {
      Title: title,
      Author: author
    },
    UpdateExpression: "set MeetingDate = :date, Blog = :blog",
    ExpressionAttributeValues: {
      ":date": meetingDate,
      ":blog": url
    },
  };

  dynamo.updateItem(payload, callback);
}

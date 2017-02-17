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
*   - (optional) blog
*/
exports.handler = (event, context, callback) => {
  const title = decodeURI(event.params.path.title);
  const author = decodeURI(event.params.path.author);
  const meetingDate = event.params.path.meetingDate
  const blog = event.params.path.blog;

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
      ":blog": blog
    },
  };

  dynamo.updateItem(payload, callback);
}

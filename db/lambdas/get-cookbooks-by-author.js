'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Get all cookbooks by author in DynamoDB
*
* Provide an event that contains the following keys:
*   - author
*/
exports.handler = (event, context, callback) => {
  const author = event.author;

  // Check required fields are entered
  let validationError = '';
  if (!author) {
    validationError += 'Select an author \n';
  }

  if (validationError) {
    callback (validationError);
  }

  const payload = {
    TableName: 'Cookbook',
    KeyConditionExpression: 'Author = :author',
    ExpressionAttributeValues: {
      ':author': author,
    }
  };

  // get all cookbooks
  dynamo.query(payload, function (err, data) {
    if (err) {
      callback(err);
    }

    let response = [];
    const items = (data && data.Items) ? data.Items : [];

    // format JSON
    items.forEach(function (element) {
      const formattedResult = {
        title: element.Title,
        author: element.Author
      };

      if (element.Blog) {
        formattedResult.blog = element.Blog;
      }

      if (element.MeetingDate) {
        formattedResult.isoDate = element.MeetingDate;
        formattedResult.displayDate = new Date(element.MeetingDate).toLocaleDateString();
      }

      response.push(formattedResult);
    });

    callback(null, response);
  });
};

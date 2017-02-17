'use strict'

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Get a cookbook by title and author
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

  // Get item
  const payload = {
    TableName: 'Cookbook',
    Key: {
      Title: title,
      Author: author
    }
  };

  // get cookbook
  dynamo.getItem(payload, function (err, data) {
    if (err) {
      callback(err);
    }

    let response = {};

    if (data.Item) {
      const item = data.Item;
      response = {
        title: item.Title,
        author: item.Author
      };

      if (item.Blog) {
        response.blog = item.Blog;
      }

      if (item.MeetingDate) {
        response.isoDate = item.MeetingDate;
        response.displayDate = new Date(item.MeetingDate).toLocaleDateString();
      }
    }

    callback(null, response);
  });
}

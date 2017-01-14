'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
* Get all cookbooks in DynamoDB
*
* Provide an event that contains the following keys:
*   - sortBy: property to sort on (title, author, date);  date is default.
*   - sortOrder: ordering (asc, desc); desc is default
*/
exports.handler = (event, context, callback) => {
  const payload = {
    TableName: 'Cookbook'
  };

  const sortBy = event.sortBy ? event.sortBy : 'date';
  const sortOrder = event.sortOrder ? event.sortOrder : 'desc';

  // get all cookbooks
  dynamo.scan(payload, function (err, data) {
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

    // apply sorting
    if (sortBy === 'title' || sortBy === 'author') {
      response.sort(function (a, b) {
        if (sortOrder === 'asc') {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        else {
          return b[sortBy].localeCompare(a[sortBy]);
        }
      });
    }
    else {
      // sort books by meeting date desc, cookbooks with no date will appear at end
      response.sort(function (a, b) {
        if (!a.isoDate && b.isoDate) {
          return 1;
        }
        else if (!a.isoDate && !b.isoDate) {
          // If no date on both, sort by title asc
          return a.title - b.title;
        }
        else if (sortOrder === 'asc') {
          return new Date(a.isoDate) - new Date(b.isoDate);
        }
        else {
          return new Date(b.isoDate) - new Date(a.isoDate);
        }
      });
    }

    callback(null, response);
  });
};

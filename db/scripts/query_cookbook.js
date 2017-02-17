/* Get whole Cookbook table */
var allCookbooks = {
  TableName: 'Cookbook'
};

dynamodb.scan(allCookbooks, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

/* Get a cookbook */
var getCookbook = {
  TableName: 'Cookbook',
  Key: { // a map of attribute name to AttributeValue for all primary key attributes
    Author: 'Giada De Laurentiis',
    Title: 'Everyday Italian', //(string | number | boolean | null | Binary)
  }
};

docClient.get(getCookbook, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

/* Get all cookbooks by authors */
var booksByAuthor = {
  TableName : "Cookbook",
  KeyConditionExpression: "Author = :author",
  ExpressionAttributeValues: {
    ":author":"Giada De Laurentiis",
  }
};

docClient.query(booksByAuthor, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

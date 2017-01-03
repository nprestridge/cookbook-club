/* Get whole User table */
var allUsers = {
  TableName: 'User'
};

dynamodb.scan(allUsers, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

/* Get user by ID */
var getUser = {
  TableName: 'User',
  Key: { // a map of attribute name to AttributeValue for all primary key attributes
    Id: 1,
  }
};

docClient.get(getUser, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

/* Search for users by  name */
var searchByName = {
  TableName : "User",
  IndexName: "FirstNameIndex",
  KeyConditionExpression: "FirstName = :name",
  ExpressionAttributeValues: {
    ":name": "Nancy"
  },
};

docClient.query(searchByName, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

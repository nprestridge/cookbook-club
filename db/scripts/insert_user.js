// Bulk insert - Users
var users = {
  RequestItems: {
    User: [
      {
        PutRequest: {
          Item: {
            Id: 1,
            FirstName: 'Nancy'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Id: 2,
            FirstName: 'Nadine'
          }
        }
      },
    ],
    // ... more tables ...
  },
  ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
  ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};
docClient.batchWrite(users, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

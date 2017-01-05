// Bulk insert - Users
var users = {
  RequestItems: {
    User: [
      {
        PutRequest: {
          Item: {
            Email: 'nancy@mail.com',
            FirstName: 'Nancy'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Email: 'nadine@mail.com',
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

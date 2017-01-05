// Bulk insert - Users
var users = {
  RequestItems: {
    User: [
      {
        PutRequest: {
          Item: {
            Email: 'kathy@mail.com',
            FirstName: 'kathy'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Email: 'kristine@mail.com',
            FirstName: 'Krisine'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Email: 'lisa@mail.com',
            FirstName: 'Lisa'
          }
        }
      },
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
      {
        PutRequest: {
          Item: {
            Email: 'tammy@mail.com',
            FirstName: 'Tammy'
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

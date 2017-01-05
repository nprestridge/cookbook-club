/* CREATE TABLE - User */
var params = {
  TableName: 'User',
  KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
    { // Required HASH type attribute
      AttributeName: 'Email',
      KeyType: 'HASH',
    }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'FirstNameIndex',
      KeySchema: [
        {
          AttributeName: 'FirstName',
          KeyType: 'HASH'
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      }
    }
  ],
  AttributeDefinitions: [ // The names and types of all primary and index key attributes only
    {
      AttributeName: 'Email',
      AttributeType: 'S', // (S | N | B) for string, number, binary
    },
    {
      AttributeName: 'FirstName',
      AttributeType: 'S', // (S | N | B) for string, number, binary
    },
  ],
  ProvisionedThroughput: { // required provisioned throughput for the table
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

dynamodb.createTable(params, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

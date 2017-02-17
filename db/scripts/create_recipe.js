/* CREATE TABLE - Recipe */
var params = {
  TableName: 'Recipe',
  KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
    { // Required HASH type attribute
      AttributeName: 'Cookbook',
      KeyType: 'HASH',
    },
    { // Optional RANGE key type for HASH + RANGE tables
      AttributeName: 'Name',
      KeyType: 'RANGE',
    }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'UserEmailIndex',
      KeySchema: [
        {
          AttributeName: 'UserEmail',
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
    },
    {
      IndexName: 'CookbookRecipeIndex',
      KeySchema: [
        {
          AttributeName: 'CookbookRecipe',
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
      AttributeName: 'Cookbook',
      AttributeType: 'S', // (S | N | B) for string, number, binary
    },
    {
      AttributeName: 'Name',
      AttributeType: 'S', // (S | N | B) for string, number, binary
    },
    {
      AttributeName: 'UserEmail',
      AttributeType: 'S', // (S | N | B) for string, number, binary
    }
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

/* CREATE TABLE - RecipeTag */
var params = {
  TableName: 'RecipeTag',
  KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
    { // Required HASH type attribute
      AttributeName: 'Tag',
      KeyType: 'HASH',
    },
    { // Optional RANGE key type for HASH + RANGE tables
      AttributeName: 'CookbookRecipe',
      KeyType: 'RANGE',
    }
  ],
  GlobalSecondaryIndexes: [
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
      AttributeName: 'Tag',
      AttributeType: 'S', // (S | N | B) for string, number, binary
    },
    {
      AttributeName: 'CookbookRecipe',
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

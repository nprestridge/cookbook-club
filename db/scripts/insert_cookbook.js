/**
  INSERT Test Data
**/
var cookbookData = {
  TableName: 'Cookbook',
  Item: { // a map of attribute name to AttributeValue
    Title: 'Everyday Italian',
    Author: 'Giada De Laurentiis',
    MeetingDate: '2016-26-03',
    Images: [
      'all-dishes.jpg',
      'table.jpg'
    ]
    // attribute_value (string | number | boolean | null | Binary | DynamoDBSet | Array | Object)
    // more attributes...
  },
  // ConditionExpression: 'attribute_not_exists(attribute_name)', // optional String describing the constraint to be placed on an attribute
  // ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
  //     //'#name': 'attribute name'
  // },
  // ExpressionAttributeValues: { // a map of substitutions for all attribute values
  //     //':value': 'VALUE'
  // },
  ReturnValues: 'NONE', // optional (NONE | ALL_OLD)
  ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
  ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};
docClient.put(cookbookData, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

// Bulk insert
var books = {
  RequestItems: { // A map of TableName to Put or Delete requests for that table
    Cookbook: [ // a list of Put or Delete requests for that table
      { // An example PutRequest
        PutRequest: {
          Item: {
            Title: 'How Easy is That?',
            Author: 'Ina Garten',
            MeetingDate: '2016-05-22'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Title: 'Skinnytaste',
            Author: 'Gina Homolka',
            MeetingDate: '2016-09-07',
            Url: 'http://www.skinnytaste.com/'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Title: 'Cravings',
            Author: 'Chrissy Teigen',
            MeetingDate: '2016-24-09',
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Title: 'Smitten Kitchen',
            Author: 'Deb Perelman',
            MeetingDate: '2017-28-01',
            Url: 'https://smittenkitchen.com'
          }
        }
      },
      // ... more put or delete requests ...
    ],
    // ... more tables ...
  },
  ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
  ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};
docClient.batchWrite(books, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

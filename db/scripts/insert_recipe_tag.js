// Bulk insert - Recipe Tags
var tags = {
  RequestItems: {
    RecipeTag: [
      {
        PutRequest: {
          Item: {
            Tag: 'italian',
            RecipeId: 1
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'marinara',
            RecipeId: 1
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'ricotta',
            RecipeId: 1
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'beef',
            RecipeId: 1
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'lasagna',
            RecipeId: 1
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cheese',
            RecipeId: 1
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'ricotta',
            RecipeId: 2
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cookies',
            RecipeId: 2
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'lemon',
            RecipeId: 2
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'italian',
            RecipeId: 2
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'dessert',
            RecipeId: 2
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cupcakes',
            RecipeId: 3
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cream cheese',
            RecipeId: 3
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'dessert',
            RecipeId: 3
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'carrot',
            RecipeId: 3
          }
        }
      },
    ],
    // ... more tables ...
  },
  ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
  ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};
docClient.batchWrite(tags, function(err, data) {
  if (err) ppJson(err); // an error occurred
  else ppJson(data); // successful response
});

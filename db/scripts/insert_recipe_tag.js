// Bulk insert - Recipe Tags
var tags = {
  RequestItems: {
    RecipeTag: [
      {
        PutRequest: {
          Item: {
            Tag: 'italian',
            CookbookRecipe: 'EverydayItalian-ClassicItalianLasagna'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'marinara',
            CookbookRecipe: 'EverydayItalian-ClassicItalianLasagna'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'ricotta',
            CookbookRecipe: 'EverydayItalian-ClassicItalianLasagna'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'beef',
            CookbookRecipe: 'EverydayItalian-ClassicItalianLasagna'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'lasagna',
            CookbookRecipe: 'EverydayItalian-ClassicItalianLasagna'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cheese',
            CookbookRecipe: 'EverydayItalian-ClassicItalianLasagna'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'ricotta',
            CookbookRecipe: 'EverydayItalian-LemonRicottaCookies'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cookies',
            CookbookRecipe: 'EverydayItalian-LemonRicottaCookies'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'lemon',
            CookbookRecipe: 'EverydayItalian-LemonRicottaCookies'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'italian',
            CookbookRecipe: 'EverydayItalian-LemonRicottaCookies'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'dessert',
            CookbookRecipe: 'EverydayItalian-LemonRicottaCookies'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cupcakes',
            CookbookRecipe: 'Skinnytaste-SuperMoistCarrotCakewithCreamCheeseFrosting'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'cream cheese',
            CookbookRecipe: 'Skinnytaste-SuperMoistCarrotCakewithCreamCheeseFrosting'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'dessert',
            CookbookRecipe: 'Skinnytaste-SuperMoistCarrotCakewithCreamCheeseFrosting'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            Tag: 'carrot',
            CookbookRecipe: 'Skinnytaste-SuperMoistCarrotCakewithCreamCheeseFrosting'
          }
        }
      },,
      {
        PutRequest: {
          Item: {
            Tag: 'cake',
            CookbookRecipe: 'Skinnytaste-SuperMoistCarrotCakewithCreamCheeseFrosting'
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

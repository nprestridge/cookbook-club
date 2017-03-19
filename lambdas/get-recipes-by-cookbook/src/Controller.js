import AWS from 'aws-sdk'

export default class Controller {

  /**
   * @param {object} config values
   */
  constructor(config) {
    this.config = config;
    this.docClient = new AWS.DynamoDB.DocumentClient(config.dynamodb);
  }

   /**
   * Get all recipes by cookbook name in DynamoDB
   *
   * @param {object} event - params
   *   - author:  cookbook author
   *   - title:  cookbook title
   */
  async process(event) {
    let response = [];

    const author = decodeURIComponent(event.params.path.author);
    const cookbook = decodeURIComponent(event.params.path.title);

    // Check required fields are entered
    let validationError = '';

    if (!author) {
      validationError += 'Select an Author \n';
    }

    if (!cookbook) {
      validationError += 'Select a Cookbook \n';
    }

    if (validationError) {
      return validationError;
    }

    // TODO:  Get cookbook details

    // retrieve recipes
    const items = await this._getRecipes(cookbook);

    if (items.length > 0) {
      const users = await this._getUserMap();

      // format JSON
      items.forEach(function (element) {
        const formattedResult = {
          cookbook: element.Cookbook,
          name: element.Name,
          page: element.Page,
          link: element.Link
        };

        // Add user info
        const userEmail = element.UserEmail;
        if (users[userEmail]) {
          formattedResult.cook = users[userEmail].FirstName;
        }

        response.push(formattedResult);
      });
    }

    return response;
  }

  _getRecipes(cookbook) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: 'Recipe',
        KeyConditionExpression: 'Cookbook = :cookbook',
        ExpressionAttributeValues: {
          ':cookbook': cookbook
        }
      };

      this.docClient.query(params, function (err, data) {
        if (err) {
          console.error(err);
          return resolve([]);
        }
        return resolve(data.Items || []);
      });
    });
  }

  // Create a user map of key (email) -> user data
  _getUserMap() {
    const params = {
      TableName: 'User'
    };

    return new Promise((resolve, reject) => {
      this.docClient.scan(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        let map = {};
        const items = (data && data.Items) ? data.Items : [];
        items.forEach(function (element) {
          map[element.Email] = element;
        });

        return resolve(map);
      });
    });
  }

}

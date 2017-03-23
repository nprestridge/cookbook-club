import AWS from 'aws-sdk'

export default class Controller {

  /**
   * @param {object} configuration values
   */
  constructor(config) {
    this.config = config;
    this.docClient = new AWS.DynamoDB.DocumentClient(config.dynamodb);
  }

  /**
   * Delete a cookbook
   *
   * @param {object} event - params
   *   - author:  cookbook author
   *   - title:  cookbook title
   */
  async process(event) {
    if (event && event.params && event.params.path) {
      const title = decodeURI(event.params.path.title);
      const author = decodeURI(event.params.path.author);

      // Check required fields are entered
      let validationError = '';
      if (!title) {
        validationError += 'Enter a title \n';
      }

      if (!author) {
        validationError += 'Enter an author \n';
      }

      if (validationError) {
        return validationError;
      }

      // Do not delete if recipes are present
      const hasRecipes = await this._hasRecipes(title);
      if (!hasRecipes) {
        return await this._deleteCookbook(title, author);
      }

      return 'Cookbook has recipes which cannot be deleted.';
    }

    return 'Error deleting cookbook!';
  }

  _deleteCookbook(title, author) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: 'Cookbook',
        Key: {
          Title: title,
          Author: author
        }
      };

      this.docClient.delete(params, function (err, data) {
        if (err) {
          console.error(err);
          return resolve(err);
        }
        return resolve('Success');
      });
    });
  }

  _hasRecipes(title) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: 'Recipe',
        KeyConditionExpression: 'Cookbook = :cookbook',
        ExpressionAttributeValues: {
          ':cookbook': title,
        }
      };

      this.docClient.query(params, function (err, data) {
        if (err) {
          console.error(err);
          return reject();
        }

        if (data && data.Items && data.Items.length > 0) {
          return resolve(true);
        } else {
          resolve(false);
        }
      });

    });
  }
}

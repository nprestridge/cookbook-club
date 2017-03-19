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
   * Create/update a cookbook
   *
   * @param {object} event - params
   *   - author:  cookbook author
   *   - title:  cookbook title
   */
  async process(event) {
    if (event && event.params && event.params.path) {
      const title = decodeURI(event.params.path.title);
      const author = decodeURI(event.params.path.author);
      const meetingDate = event.params.path.meetingDate
      const blog = event.params.path.blog;

      // Check required fields are entered
      let validationError = '';
      if (!title) {
        validationError += 'Enter a title \n';
      }

      if (!author) {
        validationError += 'Enter an author \n';
      }

      // TODO - Validate date

      if (validationError) {
        return validationError;
      }

      // Insert item
      const item = {
        Title: title,
        Author: author
      };

      if (meetingDate) {
        item.MeetingDate = meetingDate;
      }

      if (blog) {
        item.Blog = blog;
      }

      return await this._updateCookbook(item);
    }

    return 'No details entered!';
  }

  _updateCookbook(item) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: 'Cookbook',
        Item: item
      };

      this.docClient.put(params, function (err, data) {
        if (err) {
          console.error(err);
          return resolve(err);
        }
        return resolve('Success');
      });
    });
  }
}

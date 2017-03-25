/**
 * Load config for ENV
 */
class Config {
  static load() {
    // default
    let config = require('./config/production.json');

    if (process.env.REACT_APP_API_ENV === 'local') {
      config = require('./config/local.json');
    }

    return config;
  }
}

export default Config;

/**
 * Load config for ENV
 */

const production = require('./config/production.json');
const local = require('./config/local.json');

class Config {
  static load() {
    // default
    let config = production;

    if (process.env.REACT_APP_API_ENV === 'local') {
      config = local;
    }

    return config;
  }
}

export default Config;

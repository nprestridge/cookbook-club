/**
 * Load config for ENV
 */
class Config {
  static load() {
    let config = require('./config/production.json');

    return config;
  }
}

export default Config;

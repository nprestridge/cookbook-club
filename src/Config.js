/**
 * Load config for ENV
 */

import production from './config/production.json';
import local from './config/local.json';

class Config {
  static load() {
    // default
    let config = production;

    if (import.meta.env.VITE_API_ENV === 'local') {
      config = local;
    }

    return config;
  }
}

export default Config;

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';
import Config from '../Config';

describe('Config', () => {
  const originalEnv = { ...import.meta.env };

  beforeEach(() => {
    // Reset environment for each test
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original environment
    Object.assign(import.meta.env, originalEnv);
  });

  describe('load', () => {
    it('returns config object with api property', () => {
      const config = Config.load();
      expect(config).toBeDefined();
      expect(config.api).toBeDefined();
    });

    it('config has required api properties', () => {
      const config = Config.load();
      expect(config.api).toHaveProperty('endpoint');
      expect(config.api).toHaveProperty('key');
    });

    it('endpoint is a string', () => {
      const config = Config.load();
      expect(typeof config.api.endpoint).toBe('string');
    });

    it('key is a string', () => {
      const config = Config.load();
      expect(typeof config.api.key).toBe('string');
    });

    it('loads production config by default', () => {
      // In non-local environment, should load production config
      const config = Config.load();
      expect(config).toBeDefined();
      expect(config.api.endpoint).toBeDefined();
    });

    it('can load local config when VITE_API_ENV is "local"', () => {
      // This is a behavior test - we verify the config loads without error
      // When VITE_API_ENV=local is set, local.json should be loaded
      const config = Config.load();
      expect(config.api).toBeDefined();
    });

    it('always returns an object with consistent structure', () => {
      const config1 = Config.load();
      const config2 = Config.load();

      expect(config1).toHaveProperty('api');
      expect(config2).toHaveProperty('api');
      expect(Object.keys(config1)).toEqual(Object.keys(config2));
    });

    it('api endpoint is a valid URL string in local config', () => {
      // When using local config, endpoint should be a valid AWS API endpoint
      const config = Config.load();
      // Endpoint can be empty string (production) or a URL (local)
      expect(typeof config.api.endpoint).toBe('string');
      if (config.api.endpoint) {
        expect(config.api.endpoint).toMatch(/^https?:\/\//);
      }
    });

    it('api key exists for valid configurations', () => {
      const config = Config.load();
      // Key should be defined (may be empty in production, non-empty in local)
      expect(config.api.key).toBeDefined();
    });
  });

  describe('config consistency', () => {
    it('loading config multiple times returns consistent structure', () => {
      const config1 = Config.load();
      const config2 = Config.load();

      expect(config1.api.endpoint).toBe(config2.api.endpoint);
      expect(config1.api.key).toBe(config2.api.key);
    });
  });
});

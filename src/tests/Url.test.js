import {
  describe,
  it,
  expect,
} from 'vitest';
import Url from '../util/Url';

describe('Url', () => {
  describe('format', () => {
    it('returns formatted string without encoding', () => {
      const input = 'simple-string';
      const result = Url.format(input, false);
      expect(result).toBe('simple-string');
    });

    it('encodes special characters when encodeUri is true', () => {
      const input = 'Jane Doe';
      const result = Url.format(input, true);
      expect(result).toBe('Jane%20Doe');
    });

    it('replaces single quotes with %27', () => {
      const input = "O'Brien";
      const result = Url.format(input, false);
      expect(result).toBe('O%27Brien');
    });

    it('encodes single quotes correctly with encodeUri', () => {
      const input = "Chef's Recipe";
      const result = Url.format(input, true);
      expect(result).toContain('%27');
      expect(result).toContain('%20');
    });

    it('handles ampersand with encoding', () => {
      const input = 'Fish & Chips';
      const result = Url.format(input, true);
      expect(result).toContain('%26');
      expect(result).toContain('%20');
    });

    it('handles empty string', () => {
      const result = Url.format('', false);
      expect(result).toBeNull();
    });

    it('handles null input', () => {
      const result = Url.format(null, false);
      expect(result).toBeNull();
    });

    it('handles undefined input', () => {
      const result = Url.format(undefined, false);
      expect(result).toBeNull();
    });

    it('handles special characters in cookbook title', () => {
      const title = "The Great Cook's Kitchen & Pantry";
      const result = Url.format(title, true);
      expect(result).toBeDefined();
      expect(result).not.toBe(title);
      expect(result).toContain('%27');
      expect(result).toContain('%26');
    });

    it('handles single quotes with spaces (only quotes encoded)', () => {
      const input = "It's what's cooking";
      const result = Url.format(input, false);
      // Only quotes are encoded, spaces are preserved without encodeUri
      expect(result).toBe('It%27s what%27s cooking');
    });

    it('does not double-encode with encodeUri true', () => {
      const input = 'Simple';
      const result = Url.format(input, true);
      expect(result).toBe('Simple');
    });

    it('preserves hyphens and underscores', () => {
      const input = 'cook-book_name';
      const result = Url.format(input, true);
      expect(result).toBe('cook-book_name');
    });

    it('handles numbers correctly', () => {
      const input = 'Cookbook 123 & More 456';
      const result = Url.format(input, true);
      expect(result).toContain('123');
      expect(result).toContain('456');
      expect(result).toContain('%26');
    });
  });
});

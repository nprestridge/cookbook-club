import {
  describe,
  it,
  expect,
  beforeEach,
} from 'vitest';
import CookbookStore from '../controller/CookbookStore';

describe('CookbookStore', () => {
  beforeEach(() => {
    // Reset store between tests
    CookbookStore.setCookbooks([]);
  });

  describe('setCookbooks', () => {
    it('stores cookbooks in memory', () => {
      const mockBooks = [
        { id: 1, title: 'Cookbook 1', slug: 'cookbook-1' },
        { id: 2, title: 'Cookbook 2', slug: 'cookbook-2' },
      ];

      CookbookStore.setCookbooks(mockBooks);

      expect(CookbookStore.getCookbookBySlug('cookbook-1')).toEqual(mockBooks[0]);
      expect(CookbookStore.getCookbookBySlug('cookbook-2')).toEqual(mockBooks[1]);
    });

    it('replaces previous cookbooks', () => {
      const firstSet = [{ id: 1, title: 'First', slug: 'first' }];
      const secondSet = [{ id: 2, title: 'Second', slug: 'second' }];

      CookbookStore.setCookbooks(firstSet);
      expect(CookbookStore.getCookbookBySlug('first')).toBeDefined();

      CookbookStore.setCookbooks(secondSet);
      expect(CookbookStore.getCookbookBySlug('first')).toBeUndefined();
      expect(CookbookStore.getCookbookBySlug('second')).toBeDefined();
    });

    it('stores empty array', () => {
      CookbookStore.setCookbooks([]);
      expect(CookbookStore.getCookbookBySlug('any-slug')).toBeUndefined();
    });
  });

  describe('getCookbookBySlug', () => {
    beforeEach(() => {
      const mockBooks = [
        {
          id: 1,
          title: 'Test Cookbook',
          author: 'Test Author',
          slug: 'test-cookbook',
        },
        {
          id: 2,
          title: 'Another Cookbook',
          author: 'Another Author',
          slug: 'another-cookbook',
        },
      ];
      CookbookStore.setCookbooks(mockBooks);
    });

    it('returns cookbook matching slug', () => {
      const result = CookbookStore.getCookbookBySlug('test-cookbook');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          title: 'Test Cookbook',
          slug: 'test-cookbook',
        }),
      );
    });

    it('returns undefined for non-matching slug', () => {
      const result = CookbookStore.getCookbookBySlug('non-existent');
      expect(result).toBeUndefined();
    });

    it('returns undefined for empty slug', () => {
      const result = CookbookStore.getCookbookBySlug('');
      expect(result).toBeUndefined();
    });

    it('performs exact slug matching', () => {
      const result = CookbookStore.getCookbookBySlug('test');
      expect(result).toBeUndefined();

      const exactResult = CookbookStore.getCookbookBySlug('test-cookbook');
      expect(exactResult).toBeDefined();
    });

    it('is case-sensitive', () => {
      const result = CookbookStore.getCookbookBySlug('TEST-COOKBOOK');
      expect(result).toBeUndefined();
    });
  });

  describe('store isolation', () => {
    it('maintains separate state across multiple operations', () => {
      const book1 = { id: 1, title: 'Book 1', slug: 'book-1' };
      const book2 = { id: 2, title: 'Book 2', slug: 'book-2' };
      const book3 = { id: 3, title: 'Book 3', slug: 'book-3' };

      CookbookStore.setCookbooks([book1, book2]);
      expect(CookbookStore.getCookbookBySlug('book-1')).toBeDefined();
      expect(CookbookStore.getCookbookBySlug('book-3')).toBeUndefined();

      CookbookStore.setCookbooks([book2, book3]);
      expect(CookbookStore.getCookbookBySlug('book-1')).toBeUndefined();
      expect(CookbookStore.getCookbookBySlug('book-3')).toBeDefined();
    });
  });
});

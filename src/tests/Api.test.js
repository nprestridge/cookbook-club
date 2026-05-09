import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from 'vitest';
import Api from '../controller/Api';

// Mock global fetch
global.fetch = vi.fn();

describe('Api', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getCookbooks', () => {
    it('fetches cookbooks from correct endpoint', () => new Promise((resolve) => {
      const mockCookbooks = [
        { id: 1, title: 'Test Cookbook', author: 'Test Author' },
      ];

      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockCookbooks,
      });

      Api.getCookbooks((data) => {
        expect(data).toEqual(mockCookbooks);
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('cookbooks'),
          expect.any(Object),
        );
        resolve();
      });
    }));

    it('includes API key in headers', () => new Promise((resolve) => {
      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => [],
      });

      Api.getCookbooks(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'x-api-key': expect.any(String),
            }),
          }),
        );
        resolve();
      });
    }));

    it('calls callback with fetched data', () => new Promise((resolve) => {
      const mockData = [
        { id: 1, title: 'Cookbook 1' },
        { id: 2, title: 'Cookbook 2' },
      ];

      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockData,
      });

      const callback = vi.fn();
      Api.getCookbooks(callback);

      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith(mockData);
        resolve();
      }, 10);
    }));
  });

  describe('getCookbookRecipes', () => {
    it('fetches recipes for specific cookbook', () => new Promise((resolve) => {
      const mockRecipes = [{ id: 1, name: 'Recipe 1' }];
      const author = 'Test Author';
      const title = 'Test Book';

      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockRecipes,
      });

      Api.getCookbookRecipes(author, title, (data) => {
        expect(data).toEqual(mockRecipes);
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining(`recipes/${author}/${title}`),
          expect.any(Object),
        );
        resolve();
      });
    }));

    it('encodes single quotes in author and title', () => new Promise((resolve) => {
      const author = "Jane's Cooking";
      const title = "Chef's Recipes";

      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => [],
      });

      Api.getCookbookRecipes(author, title, () => {
        const url = fetch.mock.calls[0][0];
        expect(url).toContain('recipes');
        // Single quotes should be encoded
        expect(url).toContain('%27');
        resolve();
      });
    }));
  });

  describe('getRecipes', () => {
    it('fetches all recipes', () => new Promise((resolve) => {
      const mockRecipes = [
        { id: 1, name: 'Recipe 1' },
        { id: 2, name: 'Recipe 2' },
      ];

      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockRecipes,
      });

      Api.getRecipes((data) => {
        expect(data).toEqual(mockRecipes);
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('recipes'),
          expect.any(Object),
        );
        resolve();
      });
    }));
  });

  describe('updateCookbook', () => {
    it('sends POST request with cookbook data', () => new Promise((resolve) => {
      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ success: true }),
      });

      Api.updateCookbook('Title', 'Author', null, null, () => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('cookbooks'),
          expect.objectContaining({
            method: 'POST',
          }),
        );
        resolve();
      });
    }));

    it('includes optional blog and date parameters', () => new Promise((resolve) => {
      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ success: true }),
      });

      const blog = 'https://example.com';
      const date = '2024-05-09';

      Api.updateCookbook('Title', 'Author', blog, date, () => {
        const callArgs = fetch.mock.calls[0][1];
        const body = JSON.parse(callArgs.body);
        expect(body.params.path.blog).toBe(blog);
        expect(body.params.path.meetingDate).toBe(date);
        resolve();
      });
    }));
  });

  describe('deleteCookbook', () => {
    it('sends DELETE request', () => new Promise((resolve) => {
      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ success: true }),
      });

      Api.deleteCookbook('Title', 'Author', () => {
        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: 'DELETE',
          }),
        );
        resolve();
      });
    }));

    it('includes cookbook title and author in request body', () => new Promise((resolve) => {
      const title = 'Test Cookbook';
      const author = 'Test Author';

      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ success: true }),
      });

      Api.deleteCookbook(title, author, () => {
        const callArgs = fetch.mock.calls[0][1];
        const body = JSON.parse(callArgs.body);
        expect(body.params.path.title).toBe(title);
        expect(body.params.path.author).toBe(author);
        resolve();
      });
    }));
  });

  describe('error handling', () => {
    it('logs error on fetch failure', () => new Promise((resolve) => {
      const consoleSpy = vi.spyOn(console, 'log');
      fetch.mockResolvedValueOnce({
        status: 500,
        statusText: 'Internal Server Error',
      });

      Api.getCookbooks(() => {
        // This callback should not be called on error
        resolve();
      }).catch(() => {
        // Error is expected, verify console was called
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
        resolve();
      });
    }));
  });
});

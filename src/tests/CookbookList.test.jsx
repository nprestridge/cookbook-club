import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CookbookList from '../view/CookbookList';
import Api from '../controller/Api';
import CookbookStore from '../controller/CookbookStore';

vi.mock('../controller/Api');
vi.mock('../controller/CookbookStore');

const mockCookbooks = [
  {
    id: 1,
    title: 'Test Cookbook',
    author: 'Test Author',
    slug: 'test-cookbook',
    displayDate: '2024-05-09',
    thumbnail: null,
    amazon: null,
    blog: null,
  },
  {
    id: 2,
    title: 'Another Book',
    author: 'Another Author',
    slug: 'another-book',
    displayDate: '2024-05-08',
    thumbnail: 'https://example.com/thumb.jpg',
    amazon: 'https://amazon.com/book',
    blog: 'https://blog.example.com',
  },
];

describe('CookbookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    CookbookStore.setCookbooks.mockClear();
  });

  const renderCookbookList = () => render(
    <BrowserRouter>
      <CookbookList />
    </BrowserRouter>,
  );

  it('renders component without crashing', () => {
    Api.getCookbooks.mockImplementation(() => {});
    const { container } = renderCookbookList();
    expect(container).toBeInTheDocument();
  });

  it('fetches cookbooks on mount', () => {
    Api.getCookbooks.mockImplementation(() => {});
    renderCookbookList();
    expect(Api.getCookbooks).toHaveBeenCalledTimes(1);
  });

  it('calls setCookbooks when data arrives', async () => {
    Api.getCookbooks.mockImplementation((callback) => {
      callback(mockCookbooks);
    });

    renderCookbookList();

    await waitFor(() => {
      expect(CookbookStore.setCookbooks).toHaveBeenCalledWith(mockCookbooks);
    });
  });

  it('renders cookbook titles', async () => {
    Api.getCookbooks.mockImplementation((callback) => {
      callback(mockCookbooks);
    });

    renderCookbookList();

    await waitFor(() => {
      expect(screen.getByText('Test Cookbook')).toBeInTheDocument();
      expect(screen.getByText('Another Book')).toBeInTheDocument();
    });
  });

  it('renders cookbook authors', async () => {
    Api.getCookbooks.mockImplementation((callback) => {
      callback(mockCookbooks);
    });

    renderCookbookList();

    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Another Author')).toBeInTheDocument();
    });
  });

  it('renders dates', async () => {
    Api.getCookbooks.mockImplementation((callback) => {
      callback(mockCookbooks);
    });

    renderCookbookList();

    await waitFor(() => {
      expect(screen.getByText('2024-05-09')).toBeInTheDocument();
      expect(screen.getByText('2024-05-08')).toBeInTheDocument();
    });
  });

  it('handles empty cookbook list', async () => {
    Api.getCookbooks.mockImplementation((callback) => {
      callback([]);
    });

    renderCookbookList();

    await waitFor(() => {
      const articles = screen.queryAllByRole('article');
      expect(articles.length).toBe(0);
    });
  });
});

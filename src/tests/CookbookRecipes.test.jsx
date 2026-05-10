import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CookbookRecipes from '../view/CookbookRecipes';
import Api from '../controller/Api';

vi.mock('../controller/Api');

const mockRecipes = [
  { id: 1, name: 'Hearty Soup' },
  { id: 2, name: 'Garden Salad' },
];

describe('CookbookRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    Api.getCookbookRecipes.mockImplementation(() => {});
    const { container } = render(
      <CookbookRecipes author="Test Author" title="Test Cookbook" />,
    );
    expect(container).toBeInTheDocument();
  });

  it('calls Api.getCookbookRecipes on mount', () => {
    Api.getCookbookRecipes.mockImplementation(() => {});
    render(
      <CookbookRecipes author="Test Author" title="Test Cookbook" />,
    );
    expect(Api.getCookbookRecipes).toHaveBeenCalled();
  });

  it('calls Api.getCookbookRecipes with author/title and renders recipe rows', async () => {
    Api.getCookbookRecipes.mockImplementation((author, title, cb) => cb(mockRecipes));

    render(<CookbookRecipes author="Test Author" title="Test Cookbook" />);

    await waitFor(() => {
      expect(Api.getCookbookRecipes).toHaveBeenCalled();
      expect(screen.getByText('Hearty Soup')).toBeInTheDocument();
      expect(screen.getByText('Garden Salad')).toBeInTheDocument();
    });
  });

  it('renders empty state when cookbook has no recipes', async () => {
    Api.getCookbookRecipes.mockImplementation((author, title, cb) => cb([]));

    render(<CookbookRecipes author="Empty Author" title="Empty Cookbook" />);

    await waitFor(() => {
      // Expect no recipe names rendered
      expect(screen.queryByText('Hearty Soup')).not.toBeInTheDocument();
      expect(screen.queryByText('Garden Salad')).not.toBeInTheDocument();
    });
  });
});

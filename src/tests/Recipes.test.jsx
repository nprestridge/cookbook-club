import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Recipes from '../view/Recipes';
import Api from '../controller/Api';

vi.mock('../controller/Api');

const mockRecipes = [
  { id: 1, name: 'Recipe 1', cookbook: 'Alpha Cookbook' },
  { id: 2, name: 'Recipe 2', cookbook: 'Beta Cookbook' },
];

describe('Recipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(
    <BrowserRouter>
      <Recipes />
    </BrowserRouter>,
  );

  it('renders without crashing', () => {
    Api.getRecipes.mockImplementation(() => {});
    const { container } = renderComponent();
    expect(container).toBeInTheDocument();
  });

  it('calls Api.getRecipes on mount', () => {
    Api.getRecipes.mockImplementation(() => {});
    renderComponent();
    expect(Api.getRecipes).toHaveBeenCalledTimes(1);
  });

  it('displays recipes when data loads', async () => {
    Api.getRecipes.mockImplementation((callback) => {
      callback(mockRecipes);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Recipe 1')).toBeInTheDocument();
      expect(screen.getByText('Recipe 2')).toBeInTheDocument();
    });
  });

  it('calls Api.getRecipes and renders cookbook links', async () => {
    Api.getRecipes.mockImplementation((cb) => cb(mockRecipes));
    render(
      <BrowserRouter>
        <Recipes />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Alpha Cookbook' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Beta Cookbook' })).toBeInTheDocument();
    });
  });

  it('filters recipes via search input', async () => {
    Api.getRecipes.mockImplementation((cb) => cb(mockRecipes));
    render(
      <BrowserRouter>
        <Recipes />
      </BrowserRouter>,
    );

    const input = screen.getByLabelText('Search Recipes');
    await userEvent.type(input, 'Alpha');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Alpha Cookbook' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Beta Cookbook' })).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders empty state when no recipes are returned', async () => {
    Api.getRecipes.mockImplementation((cb) => cb([]));
    render(
      <BrowserRouter>
        <Recipes />
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Expect no cookbook links to be present
      expect(screen.queryByRole('link', { name: /Cookbook/ })).not.toBeInTheDocument();
    });
  });
});

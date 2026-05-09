import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Recipes from '../view/Recipes';
import Api from '../controller/Api';

vi.mock('../controller/Api');

const mockRecipes = [
  { id: 1, name: 'Recipe 1', cookbook: 'Book 1' },
  { id: 2, name: 'Recipe 2', cookbook: 'Book 2' },
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
});

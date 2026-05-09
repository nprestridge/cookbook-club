import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render } from '@testing-library/react';
import CookbookRecipes from '../view/CookbookRecipes';
import Api from '../controller/Api';

vi.mock('../controller/Api');

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
});

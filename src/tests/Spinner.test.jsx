import {
  describe,
  it,
  expect,
} from 'vitest';
import { render } from '@testing-library/react';
import Spinner from '../view/Spinner';

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

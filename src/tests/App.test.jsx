import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';

import App from '../App';

it('renders without crashing', () => {
  render(<App />);
  // Basic smoke test - app renders without throwing
  expect(document.body).toBeInTheDocument();
});

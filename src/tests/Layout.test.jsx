import {
  describe,
  it,
  expect,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../view/Layout';

describe('Layout', () => {
  const renderComponent = () => render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>,
  );

  it('renders header', () => {
    renderComponent();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders navigation', () => {
    renderComponent();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderComponent();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays logo image', () => {
    renderComponent();
    const logo = screen.getByAltText('Cookbook Club');
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('includes footer content', () => {
    renderComponent();
    const footer = screen.getByText(/Nancy.*s Hearth/);
    expect(footer).toBeInTheDocument();
  });
});

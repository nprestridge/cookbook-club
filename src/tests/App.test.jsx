import React from 'react';
import ReactDOM from 'react-dom';
import FetchMock from 'fetch-mock';
import App from '../App';

it('renders without crashing', () => {
  const cookbooks = [
    {
      title: 'Cookbook One',
      author: 'Author One',
    },
    {
      title: 'Cookbook Two',
      author: 'Author Two',
    },
  ];

  // Mock fetch
  FetchMock.get('*', cookbooks);

  const div = document.createElement('div');
  ReactDOM.render(<App />, div);

  // Unmock
  FetchMock.restore();
});

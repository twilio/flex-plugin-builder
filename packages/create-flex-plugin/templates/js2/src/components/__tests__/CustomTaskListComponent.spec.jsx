import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import CustomTaskList from '../CustomTaskList/CustomTaskList'

test('loads and displays greeting', () => {
  render(<CustomTaskList />);
  const element = screen.getByText(/This is a dismissible demo component./i);

  expect(element).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders to-do list heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/to-do list/i);
  expect(headingElement).toBeInTheDocument();
});

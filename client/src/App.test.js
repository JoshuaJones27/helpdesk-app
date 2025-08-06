import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders dashboard home and sidebar', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
  expect(screen.getByText(/tickets/i)).toBeInTheDocument();
  expect(screen.getByText(/users/i)).toBeInTheDocument();
  expect(screen.getByText(/reports/i)).toBeInTheDocument();
  expect(screen.getByText(/settings/i)).toBeInTheDocument();
});

test('navigates to tickets page', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText(/tickets/i));
  expect(screen.getByText(/ticket list goes here/i)).toBeInTheDocument();
});

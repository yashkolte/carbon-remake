import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import formReducer from '@/redux/formSlice'; // Replace with the correct path to your formReducer

import { useRouter, useSearchParams } from 'next/navigation';

import FormComponent from '../dashboard/submitform/page';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

const store = configureStore({
  reducer: {
    form: formReducer,
  },
});
const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

describe('FormComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('false'),
    });

    render(
      <Provider store={store}>
        <FormComponent />
      </Provider>
    );

    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('does not render the submit button when isReadOnly is true', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('true'),
    });

    render(
      <Provider store={store}>
        <FormComponent />
      </Provider>
    );

    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('disables form fields when isReadOnly is true', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('true'),
    });

    render(
      <Provider store={store}>
        <FormComponent />
      </Provider>
    );

    expect(screen.getByLabelText('Name')).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('redirects to Dashboard on form submission', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('false'),
    });

    render(
      <Provider store={store}>
        <FormComponent />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/Dashboard');
    });
  });

  it('updates dropdown values correctly', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('false'),
    });

    render(
      <Provider store={store}>
        <FormComponent />
      </Provider>
    );

    const genderDropdown = screen.getByText('Gender');
    fireEvent.click(genderDropdown);

    const maleOption = screen.getByText('Male');
    fireEvent.click(maleOption);

    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('handles dropdown change and updates Redux state', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('false'),
    });

    render(
      <Provider store={store}>
        <FormComponent />
      </Provider>
    );

    const departmentDropdown = screen.getByText('Department');
    fireEvent.click(departmentDropdown);

    const cseOption = screen.getByText('CSE');
    fireEvent.click(cseOption);

    expect(screen.getByText('CSE')).toBeInTheDocument();
  });

  it('accepts a valid address', () => {
    render(
      <Provider store={store}>
        <FormComponent />
      </Provider>
    );
  
    const addressInput = screen.getByLabelText('Address');
  
    // Simulate entering an address
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
  
    // Assert that the input value is updated
    expect(addressInput).toHaveValue('123 Main St');
  });
});
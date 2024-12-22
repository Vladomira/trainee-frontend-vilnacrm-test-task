/* eslint-disable import/no-extraneous-dependencies */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

import Form from '@/components/Form/Form';
import { validators } from '@/helpers/validateInputs';
import useUser from '@/hooks/useUser';

import { fetchUserData, formDataUser } from '../store';

const { suite, street, city } = fetchUserData.address;

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Integration tests for fetching, populating, and updating user data in the form component.', () => {
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useUser as jest.Mock).mockReturnValue({
      user: formDataUser,
      error: { status: null, message: null },
      updateUser: mockUpdateUser,
    });
  });
  it('renders component using mocked useUser', () => {
    render(<Form />);

    expect(screen.getByDisplayValue(formDataUser.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(formDataUser.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(formDataUser.phone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(`${street}, ${suite}, ${city}`)).toBeInTheDocument();
  });

  it('submits the form and displays success notification', async () => {
    mockUpdateUser.mockResolvedValueOnce({
      status: 200,
      message: 'User updated successfully',
    });

    render(<Form />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'jane.doe@example.com' },
    });

    fireEvent.submit(screen.getByTestId('form'));

    await waitFor(() => {
      expect(screen.getByText(/user updated successfully/i)).toBeInTheDocument();
    });

    expect(mockUpdateUser).toHaveBeenCalledWith({
      id: 1,
      user: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: fetchUserData.phone,
        address: fetchUserData.address,
      },
    });
  });
  it('displays validation errors when required fields are empty', async () => {
    render(<Form />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: '' } });
    fireEvent.blur(screen.getByLabelText(/Name/i));

    await waitFor(() => {
      expect(screen.getByText('Please type your name')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
  it('handles error returned by useUser and sets notification', async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      error: { status: 500, message: 'Failed to fetch user data' },
      updateUser: mockUpdateUser,
    });

    render(<Form />);
    const notification = screen.getByTestId('notification');

    expect(notification).toBeInTheDocument();
    expect(notification).toHaveTextContent('Failed to fetch user data');
  });

  test('calls validator and sets error when validation fails', () => {
    const mockValidator = jest.fn().mockReturnValue('This field is required');
    validators.name = mockValidator;

    render(<Form />);

    const input = screen.getByLabelText(/Name/i);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(mockValidator).toHaveBeenCalledWith('');

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
  test('updates form data when validator passes validation', async () => {
    validators.email = jest.fn().mockReturnValue('');

    render(<Form />);

    const emailInput = await screen.findByDisplayValue(formDataUser.email);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(validators.email).toHaveBeenCalledWith('test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });
  test('updates form data when no validator exists', () => {
    delete validators.phone;

    render(<Form />);

    const input = screen.getByLabelText(/Phone number/i);
    fireEvent.change(input, { target: { value: '123-456-7890' } });
    fireEvent.blur(input);

    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();

    expect(input).toHaveValue('123-456-7890');
  });
});

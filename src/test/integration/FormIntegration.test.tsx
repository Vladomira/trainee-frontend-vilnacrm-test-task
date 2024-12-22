/* eslint-disable import/no-extraneous-dependencies */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

import Form from '@/components/Form/Form';
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
  it('should use the mocked useUser hook', () => {
    const result = useUser(1);

    expect(result.user).toEqual(formDataUser);
    expect(result.updateUser).toBe(mockUpdateUser);
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
});

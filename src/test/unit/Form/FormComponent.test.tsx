// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

import FormComponent from '@/components/Form';
import fetchUser from '@/services/userService/fetchUser';
import updateUser from '@/services/userService/updateUser';

import Home, { getServerSideProps } from '../../../../pages/index';

import { fetchUserData, formDataUser } from './store';

jest.mock('@/services/userService/updateUser');
jest.mock('@/services/userService/fetchUser');

const { suite, street, city } = fetchUserData.address;

describe('FormComponent', () => {
  beforeEach(() => {
    (fetchUser as jest.Mock).mockResolvedValue(fetchUserData);

    (updateUser as jest.Mock).mockResolvedValue({
      status: 200,
      message: 'Update complete',
      userName: fetchUserData.name,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('fetches user data and populates the form fields', async () => {
    (fetchUser as jest.Mock).mockResolvedValueOnce(fetchUserData);

    const { props } = await getServerSideProps();

    render(<Home user={props.user} />);

    expect(screen.getByDisplayValue(fetchUserData.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(fetchUserData.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(fetchUserData.phone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(`${street}, ${suite}, ${city}`)).toBeInTheDocument();
  });

  it('submits the correct data to the API', async () => {
    render(<FormComponent user={formDataUser} />);

    const nameInput = await screen.findByDisplayValue(formDataUser.name);

    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), {
      target: { value: 'New Street, Suite 100, New City' },
    });

    fireEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({
        id: 1,
        user: {
          name: 'New Name',
          email: fetchUserData.email,
          phone: fetchUserData.phone,
          address: {
            street: 'New Street',
            suite: 'Suite 100',
            city: 'New City',
          },
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Update complete/i)).toBeInTheDocument();
    });
  });

  it('handles update error correctly', async () => {
    (updateUser as jest.Mock).mockRejectedValue(new Error('Failed to update user'));

    render(<FormComponent user={formDataUser} />);

    const nameInput = await screen.findByDisplayValue(formDataUser.name);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    fireEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to update user/i)).toBeInTheDocument();
    });
  });
});

// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import Form from '@/components/Form/Form';
import SaveButton from '@/components/Form/SaveButton';
import { FORM_ERROR_MESSAGES } from '@/stores/FormConstants';

import { formDataUser } from './store';

describe('Form', () => {
  // email
  it('no error message is shown when email input is valid', async () => {
    render(<Form user={formDataUser} />);

    const emailInput = screen.getByTestId('email');
    const emailError = FORM_ERROR_MESSAGES.INVALID_EMAIL;

    await waitFor(() => {
      expect(emailInput).toBeInTheDocument();
    });

    expect(screen.queryByText(emailError)).not.toBeInTheDocument();
  });
  it('displays an error message when an invalid email is provided', async () => {
    render(<Form user={{ ...formDataUser, email: 'invalid-email' }} />);

    const emailInput = screen.getByDisplayValue('invalid-email');
    const errorMessage = FORM_ERROR_MESSAGES.INVALID_EMAIL;

    await waitFor(() => {
      expect(emailInput).toBeInTheDocument();
    });

    fireEvent.blur(emailInput);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  // name
  it('no error message is shown when name is provided', async () => {
    render(<Form user={formDataUser} />);

    const nameInput = screen.getByTestId('name');
    const nameError = FORM_ERROR_MESSAGES.NAME_REQUIRED;

    await waitFor(() => {
      expect(nameInput).toBeInTheDocument();
    });

    expect(screen.queryByText(nameError)).not.toBeInTheDocument();
  });
  // // phone
  it('displays an error message when an invalid phone format is provided', async () => {
    render(<Form user={{ ...formDataUser, phone: '123456789' }} />);

    const phoneInput = screen.getByDisplayValue('123456789');
    const errorMessage = FORM_ERROR_MESSAGES.INVALID_PHONE;

    await waitFor(() => {
      expect(phoneInput).toBeInTheDocument();
    });

    fireEvent.blur(phoneInput);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  // submit button
  it('the submit button triggers the correct function', async () => {
    const mockSubmitHandler = jest.fn();

    render(<SaveButton isDisabled={false} onHandleSubmit={mockSubmitHandler} />);
    const saveButton = screen.getByTestId('save-button');

    fireEvent.click(saveButton);

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
  it('does not trigger the onClick function when disabled', () => {
    const mockSubmitHandler = jest.fn();
    render(<SaveButton isDisabled onHandleSubmit={mockSubmitHandler} />);

    const button = screen.getByTestId('save-button');

    fireEvent.click(button);

    expect(mockSubmitHandler).not.toHaveBeenCalled();
  });
  it('renders the correct label text', () => {
    render(<SaveButton isDisabled={false} onHandleSubmit={jest.fn()} />);

    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  it('should render fields of form', () => {
    render(<Form user={formDataUser} />);

    expect(screen.getByTestId('name')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('phone')).toBeInTheDocument();
    expect(screen.getByTestId('address')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<Form user={formDataUser} />);

    expect(container).toMatchSnapshot();
  });
});

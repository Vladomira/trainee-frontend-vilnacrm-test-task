/* eslint-disable import/no-extraneous-dependencies */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import SubmitButton from '@/components/Form/SubmitButton';

import setupForm from './formTestUtils';

describe('Submit button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSubmitHandler = jest.fn((e) => e.preventDefault());
  it('the submit button triggers the correct function', async () => {
    render(
      <form onSubmit={mockSubmitHandler}>
        <SubmitButton isDisabled={false} />
      </form>
    );
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
  it('does not trigger the onClick function when disabled', () => {
    render(
      <form onSubmit={mockSubmitHandler}>
        <SubmitButton isDisabled />
      </form>
    );
    const button = screen.getByTestId('submit-button');

    fireEvent.click(button);

    expect(mockSubmitHandler).not.toHaveBeenCalled();
  });
  it('does not submit the form with invalid data', async () => {
    await setupForm('email', 'invalid-email');

    const submitButton = screen.getByTestId('submit-button');

    await waitFor(() => {
      expect(screen.getByText(/Submit/i).hasAttribute('disabled'));
    });

    fireEvent.click(submitButton);

    expect(mockSubmitHandler).not.toHaveBeenCalled();
  });

  it('disables the save button when form is invalid and enables it when valid', async () => {
    const { input } = await setupForm('email', '');

    const submitButton = screen.getByTestId('submit-button');

    expect(submitButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'john.doe@example.com' } });

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('should have a light blue background color when disabled', () => {
    render(<SubmitButton isDisabled />);

    const submitButton = screen.getByTestId('submit-button');

    expect(submitButton).toBeDisabled();

    expect(submitButton).toHaveStyle({
      backgroundColor: 'rgb(168, 207, 230)',
    });
  });

  it('should have a bright blue background color when enabled', () => {
    render(<SubmitButton isDisabled={false} />);

    const submitButton = screen.getByTestId('submit-button');

    expect(submitButton).toHaveStyle({
      backgroundColor: 'rgb(30, 174, 255)',
    });
  });
});

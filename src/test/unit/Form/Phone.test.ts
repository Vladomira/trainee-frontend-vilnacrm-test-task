// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { FORM_ERROR_MESSAGES } from '@/components/Form/FormConstants';

import { formDataUser } from '../../store';

import setupForm from './formTestUtils';

describe('phone validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const { INVALID_PHONE } = FORM_ERROR_MESSAGES;
  const { NUMBERS_REQUIRED } = FORM_ERROR_MESSAGES;

  it('displays an error message when an invalid phone format is provided', async () => {
    const { input } = await setupForm('phone', '123456789');

    expect(input).toBeInTheDocument();

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText(INVALID_PHONE)).toBeInTheDocument();
    });
  });
  it('does not show an error for a valid phone format', async () => {
    const { input } = await setupForm('phone', formDataUser.phone);
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText(INVALID_PHONE)).not.toBeInTheDocument();
    });
  });
  it('shows an error when changing from valid to invalid phone number', async () => {
    const { input } = await setupForm('phone', formDataUser.phone);

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText(INVALID_PHONE)).toBeInTheDocument();
    });
  });
  it('displays an error message for non-numeric characters', async () => {
    const { input } = await setupForm('phone', formDataUser.phone);

    fireEvent.change(input, { target: { value: 'abc' } });

    await waitFor(() => {
      expect(screen.getByText(NUMBERS_REQUIRED)).toBeInTheDocument();
    });
  });
});

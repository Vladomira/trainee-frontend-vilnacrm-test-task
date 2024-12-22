// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { FORM_ERROR_MESSAGES, phonePattern } from '@/components/Form/FormConstants';

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
  it('should not be required', async () => {
    const { input } = await setupForm('phone', formDataUser.phone);

    expect(input).not.toBeRequired();
  });

  const validatePhone = (phone: string) => phonePattern.test(phone);
  test.each([
    ['missing area code', '-456-7890', false],
    ['missing digits', '123-456-78', false],
    ['non-numeric characters', '123-abc-7890', false],
    ['too many digits', '123-456-78901', true],
  ])('should validate %s', (_, phone, expected) => {
    expect(validatePhone(phone)).toBe(expected);
  });
});

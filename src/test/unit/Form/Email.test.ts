// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { emailPattern, FORM_ERROR_MESSAGES } from '@/components/Form/FormConstants';

import { formDataUser } from '../../store';

import setupForm from './formTestUtils';

describe('email validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const { INVALID_EMAIL } = FORM_ERROR_MESSAGES;
  const { EMAIL_REQUIRED } = FORM_ERROR_MESSAGES;

  test('renders email input with valid value', async () => {
    const { input } = await setupForm('email', formDataUser.email);

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(formDataUser.email);
    expect(screen.queryByText(INVALID_EMAIL)).not.toBeInTheDocument();
  });
  it('displays an error message when an invalid email is provided', async () => {
    const { input } = await setupForm('email', 'invalid-email');

    await waitFor(() => {
      expect(input).toBeInTheDocument();
    });

    fireEvent.blur(input);
    await waitFor(() => {
      expect(screen.getByText(INVALID_EMAIL)).toBeInTheDocument();
    });
  });

  it('shows and removes the error message appropriately based on input validity', async () => {
    const { input } = await setupForm('email', 'invalid-email');

    expect(input).toBeInTheDocument();

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText(INVALID_EMAIL)).toBeInTheDocument();
    });

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'valid@example.com' } });

    await waitFor(() => {
      expect(screen.queryByText(INVALID_EMAIL)).not.toBeInTheDocument();
    });
  });

  it('reacts correctly when changing from a valid value to an invalid value', async () => {
    const { input } = await setupForm('email', formDataUser.email);

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText(INVALID_EMAIL)).not.toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input).toHaveValue('invalid-email');
    });

    await waitFor(() => {
      expect(screen.getByText(INVALID_EMAIL)).toBeInTheDocument();
    });
  });

  const invalidEmails = [
    ['missing top-level domain', 'test@domain', INVALID_EMAIL],
    ['missing local part', '@domain.com', INVALID_EMAIL],
    ['empty email input', '', EMAIL_REQUIRED],
  ];

  test.each(invalidEmails)(
    'should display an error for email addresses %s',
    async (_, email, expectedError) => {
      const { input } = await setupForm('email', email);

      fireEvent.change(input, { target: { value: email } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText(expectedError)).toBeInTheDocument();
      });
    }
  );

  it('trims spaces and does not display an error for valid emails with extra spaces', async () => {
    const { input } = await setupForm('email', '  test@example.com');

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText(INVALID_EMAIL)).not.toBeInTheDocument();
    });

    expect(input).toHaveValue('test@example.com');
  });
  it('should be required', async () => {
    const { input } = await setupForm('email', formDataUser.email);

    expect(input).toBeRequired();
  });
  const validateEmail = (email: string) => emailPattern.test(email) || INVALID_EMAIL;
  test.each([
    ['valid email', 'test@example.com', true],
    ['missing @ symbol', 'testexample.com', INVALID_EMAIL],
    ['missing domain', 'test@.com', INVALID_EMAIL],
    ['missing top-level domain', 'test@example', INVALID_EMAIL],
    ['special characters', 'test!@example.com', INVALID_EMAIL],
  ])('should validate %s', (_, email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});

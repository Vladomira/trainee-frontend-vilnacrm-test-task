// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { FORM_ERROR_MESSAGES } from '@/components/Form/FormConstants';

import { formDataUser } from '../../store';

import setupForm from './formTestUtils';

describe('Name input', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const { NAME_REQUIRED } = FORM_ERROR_MESSAGES;
  const { INVALID_NAME } = FORM_ERROR_MESSAGES;

  it('no error message is shown when the correct name is provided', async () => {
    const { input } = await setupForm('name', formDataUser.name);

    await waitFor(() => {
      expect(input).toBeInTheDocument();
    });

    expect(screen.queryByText(NAME_REQUIRED)).not.toBeInTheDocument();
  });
  it('displays an error message when name input is empty', async () => {
    const { input } = await setupForm('name', '');

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText(NAME_REQUIRED)).toBeInTheDocument();
    });
  });
  it('displays an error for names containing numbers or special characters', async () => {
    const { input } = await setupForm('name', formDataUser.name);

    expect(input).toBeInTheDocument();
    expect(screen.queryByText(INVALID_NAME)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'John123' } });

    await waitFor(() => {
      expect(screen.getByText(INVALID_NAME)).toBeInTheDocument();
    });
  });
  it('trims leading and trailing spaces and does not display an error for valid trimmed name', async () => {
    const { input } = await setupForm('name', formDataUser.name);

    fireEvent.change(input, { target: { value: '  John Doe  ' } });

    await waitFor(() => {
      expect(screen.queryByText(FORM_ERROR_MESSAGES.INVALID_NAME)).not.toBeInTheDocument();
    });
  });
  it('should be required', async () => {
    const { input } = await setupForm('name', formDataUser.name);

    expect(input).toBeRequired();
  });
});

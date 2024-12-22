// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { FORM_ERROR_MESSAGES } from '@/components/Form/FormConstants';
import Notification from '@/components/Notification/index';
import { ErrorInstance } from '@/types/Notification';

import { successMessage, successNotification } from '../store';

type SetupNotificationProps = ErrorInstance & {
  setNotification?: jest.Mock;
};

const setupNotification = ({
  status,
  message,
  setNotification = jest.fn(),
}: SetupNotificationProps) => {
  const notification = { status, message };

  render(<Notification setNotification={setNotification} notification={notification} />);

  return { setNotification, notification };
};

const { INVALID_EMAIL } = FORM_ERROR_MESSAGES;
jest.useFakeTimers();

describe('Notification Component', () => {
  it('renders the notification with the correct message and severity', () => {
    setupNotification({ ...successNotification });

    const notificationElement = screen.getByTestId('notification');

    expect(notificationElement).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-filledSuccess');
  });

  it('calls setNotification to clear the message', async () => {
    const mockSetNotification = jest.fn();
    setupNotification({ ...successNotification, setNotification: mockSetNotification });

    const closeButton = screen.getByRole('button', { name: /close/i });

    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockSetNotification).toHaveBeenCalledWith({ status: 200, message: null });
    });
  });

  it('renders a warning notification when status is not 200', () => {
    const notification = { status: 400, message: INVALID_EMAIL };
    const mockSetNotification = jest.fn();

    setupNotification({ ...notification, setNotification: mockSetNotification });

    expect(screen.getByText(INVALID_EMAIL)).toBeInTheDocument();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-filledWarning');
  });
});

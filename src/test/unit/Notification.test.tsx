// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import Notification from '@/components/Notification/index';
import { FORM_ERROR_MESSAGES } from '@/stores/FormConstants';

const successMessage = 'User was updated';

describe('Notification Component', () => {
  it('renders the notification with the correct message and severity', () => {
    const mockSetNotification = jest.fn();
    const notification = { status: 200, message: successMessage };

    render(<Notification setNotification={mockSetNotification} notification={notification} />);

    const notificationElement = screen.getByTestId('notification');

    expect(notificationElement).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-filledSuccess');
  });

  it('calls setNotification to clear the message when closed', () => {
    const mockSetNotification = jest.fn();
    const notification = { status: 200, message: successMessage };

    render(<Notification setNotification={mockSetNotification} notification={notification} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetNotification).toHaveBeenCalledWith({
      status: 200,
      message: null,
    });
  });

  it('hides the notification automatically after the autoHideDuration', async () => {
    const mockSetNotification = jest.fn();
    const notification = { status: 200, message: successMessage };

    render(<Notification setNotification={mockSetNotification} notification={notification} />);

    const notificationElement = screen.getByTestId('notification');
    expect(notificationElement).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockSetNotification).toHaveBeenCalledWith({
          status: 200,
          message: null,
        });
      },
      { timeout: 2100 }
    );
  });

  it('renders a warning notification when status is not 200', () => {
    const mockSetNotification = jest.fn();
    const notification = { status: 400, message: FORM_ERROR_MESSAGES.INVALID_EMAIL };

    render(<Notification setNotification={mockSetNotification} notification={notification} />);

    expect(screen.getByText(FORM_ERROR_MESSAGES.INVALID_EMAIL)).toBeInTheDocument();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-filledWarning');
  });
});

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

import { NotificationInstance } from '@/types/Notification';

type NotificationProps = {
  setNotification: (props: NotificationInstance) => void;
  notification: NotificationInstance;
};

export default function Notification({ setNotification, notification }: NotificationProps) {
  const { status, message } = notification;
  const handleNotification = () => setNotification({ status, message: null });

  return (
    <Snackbar
      open={Boolean(message)}
      onClose={handleNotification}
      autoHideDuration={2000}
      data-testid="notification"
    >
      <Alert
        onClose={handleNotification}
        severity={status === 200 ? 'success' : 'warning'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

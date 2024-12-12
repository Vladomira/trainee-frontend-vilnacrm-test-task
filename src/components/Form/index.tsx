import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { Suspense, useState } from 'react';

import { User } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';

import Form from './Form';
import styles from './Form.module.css';

const DynamicNotification = dynamic(() => import('../Notification'), {
  ssr: false,
  loading: () => <p>Loading notification...</p>,
});

export default function FormComponent({ user }: User) {
  const [error, setError] = useState<NotificationInstance>({ status: null, message: null });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Box
        className={styles.formComponentWrapper}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
      >
        <Box className={styles.backgroundImg} />

        <Form user={user} />
        {error && <DynamicNotification notification={error} setNotification={setError} />}
      </Box>
    </Suspense>
  );
}

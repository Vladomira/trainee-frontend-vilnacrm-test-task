import { Box } from '@mui/material';
import React from 'react';

import { User } from '@/types/Form';

import Form from './Form';
import styles from './Form.module.css';

export default function FormComponent({ user }: User) {
  return (
    <Box
      className={styles.formComponentWrapper}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
    >
      <Form user={user} />
    </Box>
  );
}

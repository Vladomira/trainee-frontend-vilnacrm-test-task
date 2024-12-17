import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import React, { FormEvent, useState } from 'react';

import validatePhone from '@/helpers/validatePhone';
import handleApiError from '@/services/userService/handleApiError';
import updateUser from '@/services/userService/updateUser';
import { initNotification } from '@/stores/FormConstants';
import { FormFieldEvent, FormFieldsData, User } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';

import styles from './Form.module.scss';
import SaveButton from './SaveButton';

const DynamicNotification = dynamic(() => import('../Notification'));
const gridSize = { xs: 12, md: 6 };

export default function Form({ user }: User) {
  const [formData, setFormData] = useState<FormFieldsData>(user);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<NotificationInstance>(initNotification);

  const handleChange = (e: FormFieldEvent) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const errorMessage = validatePhone(value);
      setErrors((prev) => ({ ...prev, phone: errorMessage }));
      if (!errorMessage) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onHandleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const [street, suite, city] = formData.address.split(',').map((part) => part.trim());

    try {
      const result = await updateUser({
        id: 1,
        user: { ...formData, address: { street, suite, city } },
      });
      const message = `${result.message || 'Update complete'}. User ${
        result.userName || 'Unknown'
      } was updated successfully`;

      setNotification({
        message,
        status: result.status,
      });
    } catch (error: unknown) {
      const { status, message } = handleApiError(error);
      setNotification({ status, message });
    }

    setErrors({});
  };

  const handleEvent = async ({
    event,
    action,
  }: {
    action: 'blur' | 'focus';
    event: FormFieldEvent;
  }) => {
    const { handleInputEvent } = await import('../../helpers/formHelpers');
    handleInputEvent({ event, action, setErrors });
  };
  return (
    <div className={styles.formComponentWrapper}>
      <form className={styles.formContainer} data-testid="form" onSubmit={onHandleSubmit}>
        <Grid
          container
          className={styles.centredFlexContainer}
          flexDirection="column"
          spacing={3}
          sx={{ padding: 1.5 }}
        >
          <Grid size={gridSize} className={styles.formInput}>
            <TextField
              size="small"
              name="name"
              value={formData.name}
              required
              type="text"
              variant="outlined"
              onChange={handleChange}
              label="Name"
              data-testid="name"
              onBlur={(event) => handleEvent({ event, action: 'blur' })}
              onFocus={(event) => handleEvent({ event, action: 'focus' })}
              error={Boolean(errors.name)}
              helperText={errors.name}
              autoComplete="false"
            />
          </Grid>
          <Grid size={gridSize} className={styles.formInput}>
            <TextField
              size="small"
              name="email"
              value={formData.email}
              required
              type="email"
              data-testid="email"
              variant="outlined"
              label="Email"
              error={Boolean(errors.email)}
              // onBlur={(e) => handleInputEvent(e, 'blur')}
              // onFocus={(e) => handleInputEvent(e, 'focus')}
              onBlur={(event) => handleEvent({ event, action: 'blur' })}
              onFocus={(event) => handleEvent({ event, action: 'focus' })}
              helperText={errors.email}
              onChange={handleChange}
              autoComplete="false"
            />
          </Grid>
          <Grid size={gridSize} className={styles.formInput}>
            <TextField
              size="small"
              name="phone"
              placeholder="380-999-9999"
              value={formData.phone}
              type="tel"
              data-testid="phone"
              variant="outlined"
              label="Phone number"
              onChange={handleChange}
              onBlur={(event) => handleEvent({ event, action: 'blur' })}
              onFocus={(event) => handleEvent({ event, action: 'focus' })}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              autoComplete="false"
            />
          </Grid>
          <Grid size={gridSize} className={styles.formInput}>
            <TextField
              size="small"
              name="address"
              value={formData.address}
              type="text"
              data-testid="address"
              multiline
              placeholder="Address"
              variant="outlined"
              onChange={handleChange}
              autoComplete="false"
              fullWidth
            />
          </Grid>
          <SaveButton isDisabled={!formData.name || !formData.email || Boolean(errors.email)} />
        </Grid>
      </form>
      {notification && (
        <DynamicNotification setNotification={setNotification} notification={notification} />
      )}
    </div>
  );
}

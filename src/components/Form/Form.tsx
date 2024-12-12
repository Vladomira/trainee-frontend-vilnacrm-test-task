import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { handleBlur, resetFieldState } from '@/helpers/formHelpers';
import validatePhone from '@/helpers/validatePhone';
import handleApiError from '@/services/userService/handleApiError';
import updateUser from '@/services/userService/updateUser';
import { initFormData, initNotification } from '@/stores/FormConstants';
import { FormFieldEvent, FormFieldsData, User } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';

import styles from './Form.module.css';
import SaveButton from './SaveButton';

const DynamicNotification = dynamic(() => import('../Notification'));

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

  const onHandleSubmit = async (event: React.FormEvent) => {
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

    setFormData(initFormData);
    setErrors({});
  };

  const handleInputEvent = (event: FormFieldEvent, action: 'blur' | 'focus') => {
    const { name, value } = event.target;
    if (action === 'blur') {
      handleBlur({ name, value, setErrors });
    } else if (action === 'focus') {
      resetFieldState({ name, setFormData, setErrors });
    }
  };

  return (
    <FormControl className={styles.formContainer} data-testid="form">
      {notification && (
        <DynamicNotification setNotification={setNotification} notification={notification} />
      )}
      <Grid container className={styles.centredFlexContainer} size="grow" spacing={2} columns={16}>
        <Grid size="auto">
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
            onBlur={(e) => handleInputEvent(e, 'blur')}
            onFocus={(e) => handleInputEvent(e, 'focus')}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
        </Grid>
        <Grid size="auto">
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
            onBlur={(e) => handleInputEvent(e, 'blur')}
            onFocus={(e) => handleInputEvent(e, 'focus')}
            helperText={errors.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid size="auto">
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
            onBlur={(e) => handleInputEvent(e, 'blur')}
            onFocus={(e) => handleInputEvent(e, 'focus')}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
          />
        </Grid>
        <Grid>
          <TextField
            size="medium"
            name="address"
            value={formData.address}
            type="text"
            data-testid="address"
            multiline
            minRows={2}
            maxRows={4}
            placeholder="Address"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <SaveButton
          isDisabled={!formData.name || !formData.email || Boolean(errors.email)}
          onHandleSubmit={onHandleSubmit}
        />
      </Grid>
    </FormControl>
  );
}

import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

import validatePhone from '@/helpers/validatePhone';
import handleApiError from '@/services/userService/handleApiError';
import updateUser from '@/services/userService/updateUser';
import {
  FORM_ERROR_MESSAGES,
  emailPattern,
  initFormData,
  initNotification,
  phonePattern,
} from '@/stores/FormConstants';
import { FormFieldEvent, FormFieldsData } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';

import Notification from '../Notification';

import SaveButton from './SaveButton';

type FormProps = {
  formData: FormFieldsData;
  setFormData: React.Dispatch<React.SetStateAction<FormFieldsData>>;
};
function Form({ formData, setFormData }: FormProps) {
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
  const handleBlur = (e: FormFieldEvent) => {
    const { name, value } = e.target;

    switch (name) {
      case 'email':
        if (!value.match(emailPattern) && value.length > 0) {
          setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.INVALID_EMAIL }));
        } else if (value.length === 0) {
          setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.EMAIL_REQUIRED }));
        }
        break;
      case 'phone':
        if (!value.match(phonePattern) && value.length > 0)
          setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.INVALID_PHONE }));
        break;

      case 'name':
        if (value.length === 0)
          setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.NAME_REQUIRED }));
        break;

      default:
        break;
    }
  };
  const errorReset = (e: FormFieldEvent) => {
    const { name } = e.target;

    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };
  const formDataReset = (e: FormFieldEvent) => {
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: '' }));
  };

  const onHandleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const [street, suite, city] = formData.address.split(',').map((part) => part.trim());

    try {
      const result = await updateUser({
        id: 1,
        user: { ...formData, address: { street, suite, city } },
      });
      const message = `${result.message || 'Update complete'}.User ${
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

  return (
    <FormControl
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 0px 0px',
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      data-testid="form"
    >
      {notification && (
        <Notification setNotification={setNotification} notification={notification} />
      )}
      <Grid
        container
        direction="column"
        display="flex"
        justifyContent="center"
        alignItems="center"
        size="grow"
        spacing={2}
        columns={16}
      >
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
            onBlur={handleBlur}
            error={Boolean(errors.name)}
            helperText={errors.name}
            onFocus={(e) => {
              formDataReset(e);
              errorReset(e);
            }}
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
            onBlur={handleBlur}
            onFocus={(e) => {
              formDataReset(e);
              errorReset(e);
            }}
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
            onFocus={(e) => {
              formDataReset(e);
              errorReset(e);
            }}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            onBlur={handleBlur}
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
          isDisabled={!formData || !formData.email || Boolean(errors.email)}
          onHandleSubmit={onHandleSubmit}
        />
      </Grid>
    </FormControl>
  );
}

export default Form;

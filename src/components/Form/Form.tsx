import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

import { FormFieldEvent, FormDataProps } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';
import handleApiError from 'pages/api/userService/handleError';
import updateUser from 'pages/api/userService/updateUser';

import Notification from '../Notification';

const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const phonePattern = /\d{1,3}-\d{3}-\d{4}/;

type FormProps = {
  user: FormDataProps;
};

function Form({ user }: FormProps) {
  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<NotificationInstance>({
    status: null,
    message: null,
  });

  const handleChange = (e: FormFieldEvent) => {
    const { name, value } = e.target;
    if (name === 'phone' && /[a-zA-Z]/.test(value)) {
      setErrors((prev) => ({ ...prev, [name]: 'Please type numbers' }));
    } else setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = (e: FormFieldEvent) => {
    const { name, value } = e.target;

    switch (name) {
      case 'email':
        if (!value.match(emailPattern) && value.length > 0) {
          setErrors((prev) => ({ ...prev, [name]: 'Invalid email format' }));
        } else if (value.length === 0) {
          setErrors((prev) => ({ ...prev, [name]: 'Please type email' }));
        }
        break;
      case 'phone':
        if (!value.match(phonePattern) && value.length > 0)
          setErrors((prev) => ({ ...prev, [name]: 'Wrong phone format' }));
        break;

      case 'name':
        if (value.length === 0) setErrors((prev) => ({ ...prev, [name]: 'Please type your name' }));
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

  const onHandleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const result = await updateUser({ id: 1, user: formData });
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

    setFormData(user);
    setErrors({});
  };

  return (
    <Box
      component="form"
      padding="50px 0px 0px"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
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
            multiline
            minRows={2}
            maxRows={4}
            placeholder="Street, suite, city"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>

        <Button
          variant="outlined"
          disabled={!formData || !formData.email || Boolean(errors.email)}
          size="medium"
          type="submit"
          onClick={onHandleSubmit}
        >
          Submit
        </Button>
      </Grid>
    </Box>
  );
}

export default Form;

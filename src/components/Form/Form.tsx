import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

import { FormFieldEvent, FromDataProps } from '@/types/Form';

const defaultPhone = '380 00 000 00 00';
const initFormData: FromDataProps = {
  name: '',
  email: '',
  phone: defaultPhone,
  address: '',
};
const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const phonePattern = /^380\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/;

function Form() {
  const [formData, setFormData] = useState(initFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: FormFieldEvent) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
  const onErrorReset = (e: FormFieldEvent) => {
    const { name } = e.target;

    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };
  const resetPhoneIfDefault = () =>
    formData.phone === defaultPhone ? setFormData((prev) => ({ ...prev, phone: '' })) : formData;

  const onHandleSubmit = () => {
    setFormData(initFormData);
    setErrors({});
  };
  return (
    <Box
      component="form"
      padding="50px 0px 0px"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
    >
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
            onFocus={onErrorReset}
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
            onFocus={onErrorReset}
            helperText={errors.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid size="auto">
          <TextField
            size="small"
            name="phone"
            placeholder={defaultPhone}
            value={formData.phone}
            type="tel"
            variant="outlined"
            label="Phone number"
            onChange={handleChange}
            onFocus={(e) => {
              resetPhoneIfDefault();
              onErrorReset(e);
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
            placeholder="Address"
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

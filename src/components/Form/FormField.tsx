import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React, { Dispatch, SetStateAction } from 'react';

import { FieldError, FormFieldEvent, HandleEventProps } from '@/types/Form';

import styles from './Form.module.scss';

const gridSize = { xs: 12, md: 6 };
type FormFieldProps = {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  name: string;
  errors: FieldError;
  handleChange: (e: FormFieldEvent) => void;
  setErrors: Dispatch<SetStateAction<FieldError>>;
};

function FormField({
  value,
  handleChange,
  setErrors,
  errors,
  label,
  placeholder,
  type,
  name,
}: FormFieldProps) {
  const handleEvent = async ({ event, action }: HandleEventProps) => {
    const { handleInputEvent } = await import('../../helpers/formHelpers');
    handleInputEvent({ event, action, setErrors });
  };
  return (
    <Grid size={gridSize} className={styles.formInput}>
      <TextField
        size="small"
        name={name}
        value={value}
        required={name !== 'address' && name !== 'phone'}
        type={type}
        variant="outlined"
        placeholder={placeholder}
        onChange={handleChange}
        label={label}
        data-testid={name}
        onBlur={(event) => handleEvent({ event, action: 'blur' })}
        onFocus={(event) => handleEvent({ event, action: 'focus' })}
        error={Boolean(errors[name])}
        helperText={errors[name]}
        autoComplete="false"
        fullWidth={name === 'address'}
        multiline={name === 'address'}
      />
    </Grid>
  );
}

export default FormField;

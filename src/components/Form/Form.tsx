import Grid from '@mui/material/Grid2';
import dynamic from 'next/dynamic';
import React, { FormEvent, useEffect, useState } from 'react';

import { fields, initialUser, initNotification } from '@/components/Form/FormConstants';
import { validators } from '@/helpers/validateInputs';
import useUser from '@/hooks/useUser';
import { FieldError, FormFieldEvent, FormFieldsData } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';

import styles from './Form.module.scss';
import FormField from './FormField';
import SubmitButton from './SubmitButton';

const DynamicNotification = dynamic(() => import('../Notification'));

export default function Form() {
  const [formData, setFormData] = useState<FormFieldsData>(initialUser);
  const [notification, setNotification] = useState<NotificationInstance>(initNotification);
  const [errors, setErrors] = useState<FieldError>({});
  const { user, error, updateUser } = useUser(1);

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else if (error) {
      const { status, message } = error;
      setNotification({ status, message });
    }
  }, [user, error]);

  const handleChange = (e: FormFieldEvent) => {
    const { name, value } = e.target;

    const validate = validators[name];
    if (validate) {
      const errorMsg = validate(value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg || '' }));
      if (!errorMsg) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onHandleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const [street, suite, city] = formData.address.split(',').map((part) => part.trim());
    const updatedUser = { ...formData, address: { street, suite, city } };

    const { status, message } = await updateUser({ id: 1, user: updatedUser });

    setNotification({ status, message });

    setErrors({});
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
          {fields.map(({ name, label, placeholder, type }) => (
            <FormField
              key={label}
              value={formData[name]}
              errors={errors}
              handleChange={handleChange}
              setErrors={setErrors}
              label={label}
              placeholder={placeholder}
              type={type}
              name={name}
            />
          ))}

          <SubmitButton isDisabled={!formData.name || !formData.email || Boolean(errors.email)} />
        </Grid>
      </form>
      {notification && (
        <DynamicNotification setNotification={setNotification} notification={notification} />
      )}
    </div>
  );
}

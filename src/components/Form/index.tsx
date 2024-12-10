import React, { useEffect, useState } from 'react';

import fetchUser from '@/services/userService/fetchUser';
import handleApiError from '@/services/userService/handleApiError';
import { initFormData } from '@/stores/FormConstants';
import { FormFieldsData } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';

import Notification from '../Notification';

import Form from './Form';

function FormComponent() {
  const [formData, setFormData] = useState<FormFieldsData>(initFormData);
  const [error, setError] = useState<NotificationInstance>({ status: null, message: null });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const result = await fetchUser(1);
        const { name, email, phone, address } = result;

        const { city, street, suite } = address;
        setFormData({
          name,
          email,
          phone: phone.split('x')[0],
          address: `${street}, ${suite}, ${city}`,
        });
      } catch (err) {
        const { status, message } = handleApiError(error);
        setError({ status, message });
      }
    };

    getUserData();
  }, []);

  return (
    <>
      {error && <Notification notification={error} setNotification={setError} />}
      <Form formData={formData} setFormData={setFormData} />
    </>
  );
}

export default FormComponent;

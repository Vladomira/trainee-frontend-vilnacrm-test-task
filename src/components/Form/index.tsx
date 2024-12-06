import React, { useEffect, useState } from 'react';

import { FormDataProps } from '@/types/Form';
import { NotificationInstance } from '@/types/Notification';
import fetchUser from 'pages/api/userService/fetchUser';
import handleApiError from 'pages/api/userService/handleError';

import Notification from '../Notification';

import Form from './Form';

export const initFormData: FormDataProps = {
  name: '',
  email: '',
  phone: '',
  address: '',
};
function FormComponent() {
  const [defaultUser, setDefaultUser] = useState<FormDataProps>(initFormData);
  const [error, setError] = useState<NotificationInstance>({ status: null, message: null });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const result = await fetchUser(1);
        const { name, email, phone, address } = result;

        const { city, street, suite } = address;

        setDefaultUser({
          name,
          email,
          phone: phone.split('x')[0],
          address: `${city}, ${street},${suite}`,
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
      {defaultUser.name.length > 0 && <Form user={defaultUser} />}
    </>
  );
}

export default FormComponent;

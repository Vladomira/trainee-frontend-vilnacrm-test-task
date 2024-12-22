import { useEffect, useState } from 'react';

import fetchUser from '@/services/userService/fetchUser';
import handleApiError from '@/services/userService/handleApiError';
import { FormFieldsData } from '@/types/Form';
import { ErrorInstance } from '@/types/Notification';

import doUserApiUpdate, { UpdateUserProps } from '../services/userService/updateUser';

interface UseUserReturn {
  user: FormFieldsData | null;
  error: { status: number | null; message: string | null };
  updateUser: (data: UpdateUserProps) => Promise<{ status: number; message: string }>;
}
const useUser = (id: number): UseUserReturn => {
  const [user, setUser] = useState<FormFieldsData | null>(null);
  const [error, setError] = useState<ErrorInstance>({
    status: null,
    message: null,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await fetchUser(id);
        const { name, email, phone, address } = result;
        const { city, street, suite } = address;
        setUser({
          name,
          email,
          phone: phone.split('x')[0].trim(),
          address: `${street}, ${suite}, ${city}`,
        });
      } catch (err) {
        const { status, message } = handleApiError(err);
        setError({ status, message });
      }
    };

    getUser();
  }, []);

  const updateUser = async (data: UpdateUserProps) => {
    try {
      const result = await doUserApiUpdate({ id: data.id, user: data.user });

      const { name, email, phone, address } = result;
      const { city, street, suite } = address;

      setUser({
        name,
        email,
        phone: phone.split('x')[0].trim(),
        address: `${street}, ${suite}, ${city}`,
      });
      
      const message = `Update complete. User ${name || 'Unknown'} was updated successfully`;
      return { status: 200, message };
    } catch (err) {
      const { status, message } = handleApiError(err);
      setError({ status, message });
      return { status, message };
    }
  };
  return { user, error, updateUser };
};
export default useUser;

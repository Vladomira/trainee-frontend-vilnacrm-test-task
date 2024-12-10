import { AdressInstance, UserData } from '@/types/Form';

import BASE_URL from '.';

export const requestOptions = {
  method: 'PUT',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
};

type UpdateUserProps = { id: number; user: UserData & AdressInstance };
type ApiUpdateResponse = {
  message?: string;
  status: number;
  userName: string;
};
const updateUser = async ({ id, user }: UpdateUserProps): Promise<ApiUpdateResponse> => {
  const response = await fetch(`${BASE_URL}${id}`, {
    ...requestOptions,
    body: JSON.stringify(user),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || 'Failed to fetch user data', {
      cause: { status: response.status },
    });
  }

  return {
    status: response.status,
    message: responseBody.message || 'Success',
    userName: responseBody.name,
  };
};

export default updateUser;

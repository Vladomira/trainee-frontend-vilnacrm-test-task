import { ApiUser } from '@/types/Form';

import BASE_URL from '.';

export const requestOptions = {
  method: 'PUT',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
};

export type UpdateUserProps = { id: number; user: ApiUser };

const updateUser = async ({ id, user }: UpdateUserProps): Promise<ApiUser> => {
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

  return responseBody;
};

export default updateUser;

import BASE_URL from '.';

type ApiFetchResponse = {
  address: { city: string; street: string; suite: string };
  email: string;
  id: number;
  name: string;
  phone: string;
  username: string;
};

const fetchUser = async (id: number): Promise<ApiFetchResponse> => {
  const response = await fetch(`${BASE_URL}${id}`);
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message || 'Failed to fetch user data', {
      cause: { status: response.status },
    });
  }

  return responseBody;
};

export default fetchUser;

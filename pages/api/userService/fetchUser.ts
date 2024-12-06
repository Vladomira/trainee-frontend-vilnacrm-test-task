import BASE_URL from '.';

const fetchUser = async (id: number) => {
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

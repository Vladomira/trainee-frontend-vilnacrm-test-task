export type UerProps = {
  name: string;
  email: string;
  phone: string;
  address: { street: string; suite: string; city: string };
};
export const defaultUser: UerProps = {
  name: 'Leanne Graham',
  email: 'Sincere@april.biz',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
  },
  phone: '1-770-736-8031',
};

export const newUser = {
  name: 'New Name',
  email: 'new.email@example.com',
  address: { street: 'New Address', suite: 'New Suite', city: 'New City' },
  phone: '123-456-7890',
};
export const BASE_URL = 'https://jsonplaceholder.typicode.com/users/1';

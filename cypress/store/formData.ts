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

export type UserFieldValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
};


export const newUser: UserFieldValues = {
  name: 'New Name',
  email: 'new@example.com',
  address: 'New Street, New Suite, New City',
  phone: '123-456-7890',
};
export const BASE_URL = 'https://jsonplaceholder.typicode.com/users/1';

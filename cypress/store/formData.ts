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

export const fetchedData= {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: { lat: '-37.3159', lng: '81.1496' },
  },
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets',
  },
};
import { FormFieldsData } from '@/types/Form';

const suite = 'Apt. 556';
const street = 'Kulas Light';
const city = 'Gwenborough';

export const formDataUser: FormFieldsData = {
  name: 'Leanne Graham',
  email: 'Sincere@april.biz',
  address: `${street}, ${suite}, ${city}`,
  phone: '1-770-736-8031',
};
export const fetchUserData = { ...formDataUser, address: { street, suite, city } };

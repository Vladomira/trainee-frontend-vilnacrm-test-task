import { FormFieldsData } from '@/types/Form';
import { ErrorInstance } from '@/types/Notification';

export const FORM_ERROR_MESSAGES = {
  INVALID_EMAIL: 'Invalid email format',
  EMAIL_REQUIRED: 'Please type email',
  INVALID_PHONE: 'Wrong phone format',
  NAME_REQUIRED: 'Please type your name',
  INVALID_NAME: 'Only letters are allowed',
  NUMBERS_REQUIRED: 'Please type numbers',
};

export const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const phonePattern = /\d{1,3}-\d{3}-\d{4}/;

export const initNotification: ErrorInstance = {
  status: null,
  message: null,
};

export const initialUser: FormFieldsData = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

type FieldsArray = {
  name: keyof FormFieldsData;
  type: string;
  label: string;
  placeholder: string;
}[];
export const fields: FieldsArray = [
  { name: 'name', type: 'text', label: 'Name', placeholder: 'John Doe' },
  { name: 'email', type: 'email', label: 'Email', placeholder: 'example@gmail.com' },
  { name: 'phone', type: 'tel', label: 'Phone number', placeholder: '1-222-333-4444' },
  { name: 'address', type: 'text', label: 'Address', placeholder: 'Address' },
];

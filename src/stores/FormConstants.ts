export const FORM_ERROR_MESSAGES = {
  INVALID_EMAIL: 'Invalid email format',
  EMAIL_REQUIRED: 'Please type email',
  INVALID_PHONE: 'Wrong phone format',
  NAME_REQUIRED: 'Please type your name',
  NUMBERS_REQUIRED: 'Please type numbers',
};

export const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const phonePattern = /\d{1,3}-\d{3}-\d{4}/;

export const initNotification = {
  status: null,
  message: null,
};

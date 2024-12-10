import { FORM_ERROR_MESSAGES } from '@/stores/FormConstants';

const validatePhone = (value: string) => {
  if (/[a-zA-Z]/.test(value)) {
    return FORM_ERROR_MESSAGES.NUMBERS_REQUIRED;
  }
  return '';
};
export default validatePhone;

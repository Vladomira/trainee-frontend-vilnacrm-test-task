import { FORM_ERROR_MESSAGES } from '@/components/Form/FormConstants';

export const validatePhone = (value: string) => {
  if (/[a-zA-Z]/.test(value)) {
    return FORM_ERROR_MESSAGES.NUMBERS_REQUIRED;
  }
  return '';
};

export const validateName = (value: string) => {
  if (!/^[A-Za-z ]*$/.test(value)) {
    return FORM_ERROR_MESSAGES.INVALID_NAME;
  }
  return '';
};
export const validators: Record<string, (value: string) => string | null> = {
  phone: validatePhone,
  name: validateName,
};

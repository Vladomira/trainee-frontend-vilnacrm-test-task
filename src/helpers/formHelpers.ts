import { emailPattern, FORM_ERROR_MESSAGES, phonePattern } from '@/stores/FormConstants';
import { FormFieldsData } from '@/types/Form';


type ErrorResetProps = {
  name: string;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};
type FormDataResetProps = ErrorResetProps & {
  setFormData: React.Dispatch<React.SetStateAction<FormFieldsData>>;
};

export const resetFieldState = ({ name, setFormData, setErrors }: FormDataResetProps) => {
  setFormData((prev: any) => ({ ...prev, [name]: '' }));

  setErrors((prev) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: _, ...rest } = prev;
    return rest;
  });
};
// onBlur
type HandleBlurProps = ErrorResetProps & {
  value: string;
};
export const handleBlur = ({ setErrors, name, value }: HandleBlurProps) => {
  switch (name) {
    case 'email':
      if (!value.match(emailPattern) && value.length > 0) {
        setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.INVALID_EMAIL }));
      } else if (value.length === 0) {
        setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.EMAIL_REQUIRED }));
      }
      break;
    case 'phone':
      if (!value.match(phonePattern) && value.length > 0)
        setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.INVALID_PHONE }));
      break;

    case 'name':
      if (value.length === 0)
        setErrors((prev) => ({ ...prev, [name]: FORM_ERROR_MESSAGES.NAME_REQUIRED }));
      break;

    default:
      break;
  }
};

export const formDataReset = ({ name, setFormData }: FormDataResetProps) =>
  setFormData((prev: any) => ({ ...prev, [name]: '' }));

export const errorReset = ({ name, setErrors }: ErrorResetProps) =>
  setErrors((prev) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: _, ...rest } = prev;
    return rest;
  });

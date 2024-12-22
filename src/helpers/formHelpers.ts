import { emailPattern, FORM_ERROR_MESSAGES, phonePattern } from '@/components/Form/FormConstants';
import { HandleEventProps } from '@/types/Form';

type ErrorResetProps = {
  name: string;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};

export const errorsReset = ({ name, setErrors }: ErrorResetProps) =>
  setErrors((prev) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: _, ...rest } = prev;
    return rest;
  });

// onBlur
type HandleBlurProps = ErrorResetProps & {
  value: string;
};
export const handleBlur = ({ name, value, setErrors }: HandleBlurProps) => {
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

type HandleInputProps = HandleEventProps & {
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};
export const handleInputEvent = async ({ event, action, setErrors }: HandleInputProps) => {
  const { name, value } = event.target;
  if (action === 'blur') {
    handleBlur({ name, value, setErrors });
  } else if (action === 'focus') {
    errorsReset({ name, setErrors });
  }
};

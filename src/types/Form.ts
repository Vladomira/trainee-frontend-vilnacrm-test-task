export type AddressInstance = {
  address: { street: string; suite: string; city: string };
};
export type UserData = {
  name: string;
  email: string;
  phone: string;
};

// for request and response from the server
export type ApiUser = UserData & AddressInstance;

// simplify address for user fields
export type FormFieldsData = UserData & { address: string };

export type User = { user: FormFieldsData };

export type FormFieldEvent = { target: { name: string; value: string } };
export type FieldError = { [key: string]: string };
export type HandleEventProps = { action: 'blur' | 'focus'; event: FormFieldEvent };

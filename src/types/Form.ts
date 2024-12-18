export type AddressInstance = {
  address: { street: string; suite: string; city: string };
};
export type UserData = {
  name: string;
  email: string;
  phone: string;
};

export type FormFieldsData = UserData & { address: string };
export type User = { user: FormFieldsData };
export type FormFieldEvent = { target: { name: string; value: string } };

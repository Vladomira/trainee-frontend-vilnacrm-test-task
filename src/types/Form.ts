export type FromDataProps = {
  name: string;
  email: string;
  phone: string;
  address: string;
};
export type FormFieldEvent = { target: { name: string; value: string } };
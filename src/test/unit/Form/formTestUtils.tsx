// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';

import Form from '@/components/Form/Form';
import useUser from '@/hooks/useUser';

import { formDataUser } from '../../store';

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

type FieldName = 'phone' | 'email' | 'name' | 'address';

const setupForm = async (fieldName: FieldName, value: string) => {
  const mockedUseUser = useUser as jest.Mock;
  const userData = { ...formDataUser, [fieldName]: value };
  mockedUseUser.mockReturnValue({ user: userData, error: null });

  render(<Form />);

  const input = await screen.findByDisplayValue(value.trim());

  return { input };
};
export default setupForm;

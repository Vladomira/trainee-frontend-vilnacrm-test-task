/* eslint-disable import/no-extraneous-dependencies */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import FormField from '@/components/Form/FormField';

import { formDataUser } from '../../store';

import setupForm from './formTestUtils';

describe('phone validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('change address value', async () => {
    const { input } = await setupForm('address', formDataUser.address);

    fireEvent.change(input, { target: { value: 'New street, suite, city' } });

    await waitFor(() => {
      expect(screen.getByText('New street, suite, city')).toBeInTheDocument();
    });
  });

  it('do not to be required', async () => {
    const { input } = await setupForm('address', formDataUser.address);

    expect(input).not.toBeRequired();
  });

  it('should render a multiline textarea with correct classes for the address field', async () => {
    const setErrors = jest.fn();

    render(
      <FormField
        name="address"
        value={formDataUser.address}
        handleChange={() => {}}
        errors={{}}
        label="Address"
        placeholder="Address"
        type="text"
        setErrors={setErrors}
      />
    );
    const addressInput = await screen.findByDisplayValue(formDataUser.address);

    expect(addressInput.tagName).toBe('TEXTAREA');
    expect(addressInput).toBeInTheDocument();

    expect(addressInput).toHaveClass('MuiInputBase-inputMultiline');
  });
});

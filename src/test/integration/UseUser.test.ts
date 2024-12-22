/* eslint-disable import/no-extraneous-dependencies */
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';

import useUser from '@/hooks/useUser';
import updateUser from '@/services/userService/updateUser';

import { fetchUserData, formDataUser } from '../store';

jest.mock('@/services/userService/updateUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));
global.fetch = jest.fn();

describe('UseUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user data when fetchUser is successful', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(fetchUserData),
    });

    const { result, waitForNextUpdate } = renderHook(() => useUser(1));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toEqual({ status: null, message: null });

    await waitForNextUpdate();

    expect(result.current.user).toEqual(formDataUser);
    expect(result.current.error).toEqual({ status: null, message: null });
  });

  it('returns an error when fetchUser fails', async () => {
    const mockedError = new Error('Unknown error');
    (global.fetch as jest.Mock).mockRejectedValue(mockedError);

    const { result, waitForNextUpdate } = renderHook(() => useUser(1));

    expect(result.current.user).toBeNull();

    await waitForNextUpdate();

    const { error } = result.current;
    expect(error).toEqual({
      status: 500,
      message: 'Unknown error',
    });
  });

  // Update
  it('calls updateUser and successfully updates user data', async () => {
    (updateUser as jest.Mock).mockResolvedValueOnce(fetchUserData);

    const { result, waitForNextUpdate } = renderHook(() => useUser(1));

    await waitForNextUpdate();

    await act(async () => {
      const response = await result.current.updateUser({ id: 1, user: fetchUserData });

      expect(response.status).toBe(200);
      expect(response.message).toBe(
        `Update complete. User ${fetchUserData.name} was updated successfully`
      );
    });
  });

  it('handles error when updateUser fails', async () => {
    const mockedError = new Error('API error');
    (updateUser as jest.Mock).mockRejectedValueOnce(mockedError);

    const { result, waitForNextUpdate } = renderHook(() => useUser(1));

    await waitForNextUpdate();

    await act(async () => {
      const response = await result.current.updateUser({
        id: 1,
        user: fetchUserData,
      });

      expect(response.status).toBe(500);
      expect(response.message).toBe('API error');
    });

    expect(result.current.error).toEqual({
      status: 500,
      message: 'API error',
    });
  });
});

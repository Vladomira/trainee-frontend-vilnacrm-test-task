/* eslint-disable import/no-extraneous-dependencies */

import fetchMock from 'jest-fetch-mock';

import BASE_URL from '@/services/userService';
import fetchUser from '@/services/userService/fetchUser';
import updateUser, { requestOptions } from '@/services/userService/updateUser';

import { fetchUserData } from './store';

fetchMock.enableMocks();
const id = 1;

describe('fetchUser', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('returns the user data when the API call is successful', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(fetchUserData), { status: 200 });

    const result = await fetchUser(id);

    expect(result).toEqual(fetchUserData);
    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}${id}`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws an error with the correct message and status when the API call fails', async () => {
    const mockErrorResponse = {
      message: 'User not found',
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 500 });

    await expect(fetchUser(999)).rejects.toThrow('User not found');
    try {
      await fetchUser(999);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}999`);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws a generic error when no message is provided in the response body', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    await expect(fetchUser(id)).rejects.toThrow('Failed to fetch user data');

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}1`);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('updateUser', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('returns the correct response when the API call is successful', async () => {
    const name = 'Lana White';
    const mockResponse = {
      message: 'Success',
      name,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await updateUser({ id, user: { ...fetchUserData, name } });

    expect(result).toEqual({
      status: 200,
      message: 'Success',
      userName: name,
    });

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}${id}`, {
      ...requestOptions,
      body: JSON.stringify({ ...fetchUserData, name }),
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws an error when the API call fails', async () => {
    const mockErrorResponse = {
      message: 'Invalid user data',
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 400 });

    await expect(updateUser({ id, user: fetchUserData })).rejects.toThrow(
      new Error('Invalid user data')
    );

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}${id}`, {
      ...requestOptions,
      body: JSON.stringify(fetchUserData),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws a default error message if the API fails without a message', async () => {
    fetchMock.mockResponseOnce('{}', { status: 500 });

    await expect(updateUser({ id, user: fetchUserData })).rejects.toThrow(
      new Error('Failed to fetch user data')
    );

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}${id}`, {
      ...requestOptions,
      body: JSON.stringify(fetchUserData),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

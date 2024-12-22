import updateUser from '@/services/userService/updateUser';

import { fetchUserData } from '../../store';

jest.mock('@/services/userService/updateUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockedUpdateUser = updateUser as jest.Mock;
const id = 1;

describe('updateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes the correct API call', async () => {
    mockedUpdateUser.mockResolvedValue(fetchUserData);

    const result = await updateUser({ id, user: fetchUserData });

    expect(result).toEqual(fetchUserData);
    expect(mockedUpdateUser).toHaveBeenCalledWith({ id, user: fetchUserData });
    expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
  });

  it('throws an error when the API call fails', async () => {
    const mockErrorResponse = new Error('Invalid user data');

    mockedUpdateUser.mockRejectedValueOnce(mockErrorResponse);

    await expect(updateUser({ id, user: fetchUserData })).rejects.toThrow('Invalid user data');
    expect(mockedUpdateUser).toHaveBeenCalledWith({ id, user: fetchUserData });
    expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
  });
  it('throws an unknown error', async () => {
    const errorResponse = {
      status: 500,
      message: 'Unknown error',
    };

    mockedUpdateUser.mockRejectedValue(
      new Error(errorResponse.message, { cause: { status: errorResponse.status } })
    );

    await expect(updateUser({ id, user: fetchUserData })).rejects.toThrow('Unknown error');
  });
});

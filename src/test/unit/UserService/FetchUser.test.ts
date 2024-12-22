import fetchUser from '@/services/userService/fetchUser';

import { fetchUserData } from '../../store';

jest.mock('@/services/userService/fetchUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const id = 1;
const mockedFetchUser = fetchUser as jest.Mock;
describe('fetchUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the user data when the API call is successful', async () => {
    mockedFetchUser.mockResolvedValue(fetchUserData);

    const result = await fetchUser(id);

    expect(result).toEqual(fetchUserData);
    expect(mockedFetchUser).toHaveBeenCalledWith(id);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
  });

  it('throws an error when the API call fails', async () => {
    const errorResponse = {
      message: 'User not found',
      status: 404,
    };

    mockedFetchUser.mockRejectedValue(
      new Error(errorResponse.message, { cause: { status: errorResponse.status } })
    );

    await expect(fetchUser(id)).rejects.toThrow('User not found');
    expect(mockedFetchUser).toHaveBeenCalledWith(id);
    expect(mockedFetchUser).toHaveBeenCalledTimes(1);
  });
  it('throws an error when a server error occurs', async () => {
    const errorResponse = {
      message: 'Internal Server Error',
      status: 500,
    };

    mockedFetchUser.mockRejectedValue(
      new Error(errorResponse.message, { cause: { status: errorResponse.status } })
    );

    await expect(fetchUser(id)).rejects.toThrow('Internal Server Error');
  });
});

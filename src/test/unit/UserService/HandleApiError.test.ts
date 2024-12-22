import handleApiError from '@/services/userService/handleApiError';

describe('handleApiError', () => {
  it('should return an error with status 500 and message "Unknown error" for non-Error input', () => {
    const result = handleApiError({});
    expect(result).toEqual({ status: 500, message: 'Unknown error' });
  });

  it('should return an error with status 500 if the cause has no status', () => {
    const errorResponse = new Error('Test error');
    errorResponse.cause = { someOtherField: 'value' };

    const result = handleApiError(errorResponse);
    expect(result).toEqual({ status: 500, message: 'Test error' });
  });

  it('should return an error with status from the cause if the cause has a status', () => {
    const errorResponse = new Error('User not found');
    errorResponse.cause = { status: 404 };

    const result = handleApiError(errorResponse);
    expect(result).toEqual({ status: 404, message: 'User not found' });
  });

  it('should return an error with status 500 and message "Unknown error" if the error is not an instance of Error', () => {
    const result = handleApiError('Some unknown error');
    expect(result).toEqual({ status: 500, message: 'Unknown error' });
  });
});

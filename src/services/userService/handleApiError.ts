type ApiError = {
  status: number;
  message: string;
};

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    const status =
      error.cause && typeof error.cause === 'object' && 'status' in error.cause
        ? (error.cause as { status: number }).status
        : 500;
    return { status, message: error.message };
  }
  return { status: 500, message: 'Unknown error' };
};
export default handleApiError;

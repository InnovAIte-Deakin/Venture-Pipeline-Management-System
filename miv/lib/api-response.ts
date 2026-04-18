export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse(
  message: string,
  code = 'INTERNAL_SERVER_ERROR',
  details?: unknown
) {
  return {
    success: false,
    error: {
      message,
      code,
      details: details ?? null,
    },
  }
}
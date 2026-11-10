export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}

export async function handleApiError(
  response: Response,
  fallbackMessage = "Something went wrong.",
): Promise<never> {
  const result = await response.json().catch(() => null);

  const serverMessage =
    typeof result?.message === "string"
      ? result.message
      : typeof result?.detail === "string"
        ? result.detail
        : typeof result?.errors?.[0]?.message === "string"
          ? result.errors[0].message
          : null;

  let message = serverMessage || fallbackMessage;

  if (!serverMessage) {
    switch (response.status) {
      case 400:
        message = "Invalid request. Please check your information.";
        break;

      case 401:
        message = "Your session has expired. Please log in again.";
        break;

      case 403:
        message = "You don't have permission to perform this action.";
        break;

      case 404:
        message = "The requested resource was not found.";
        break;

      case 429:
        message = "Too many requests. Please try again later.";
        break;

      default:
        if (response.status >= 500) {
          message = "Server error. Please try again later.";
        }
    }
  }

  throw new ApiError(message, response.status);
}

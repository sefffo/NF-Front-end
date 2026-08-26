// extracts a readable message from backend ProblemDetails error responses
import { AxiosError } from 'axios';

export interface ApiErrorInfo {
  status: number;
  message: string;
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

interface ProblemDetailsBody {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export const extractApiError = (error: unknown): ApiErrorInfo => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ProblemDetailsBody | undefined;
    const validationMessages = data?.errors
      ? Object.values(data.errors)
          .flat()
          .join(' ')
      : undefined;

    return {
      status: error.response?.status ?? 0,
      message:
        validationMessages ||
        data?.detail ||
        data?.title ||
        error.message ||
        FALLBACK_MESSAGE,
    };
  }

  return { status: 0, message: FALLBACK_MESSAGE };
};

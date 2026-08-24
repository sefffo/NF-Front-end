import api from '../../../api/axios';
import { AxiosError } from 'axios';

// ─── Request DTO ─────────────────────────────────────────────────────────────
export interface SendEmailRequest {
  to: string[];
  subject: string;
  body: string;
  from?: string;
  isHtml?: boolean;
  templateName?: string;
}

// ─── Success Response ────────────────────────────────────────────────────────
export interface SendEmailResponse {
  messageId: string;
}

// ─── Error shapes from backend ───────────────────────────────────────────────

/** 400 – Validation errors: field → messages[] */
export type ValidationErrorResponse = Record<string, string[]>;

/** 422 – Domain / business error */
export interface DomainErrorResponse {
  message: string;
  [key: string]: unknown;
}

// ─── Union result type returned by sendEmail() ───────────────────────────────
export type EmailApiResult =
  | { ok: true; data: SendEmailResponse }
  | { ok: false; status: 400; errors: ValidationErrorResponse }
  | { ok: false; status: 422; message: string }
  | { ok: false; status: number; message: string };

// ─── API call ────────────────────────────────────────────────────────────────
export async function sendEmail(payload: SendEmailRequest): Promise<EmailApiResult> {
  try {
    const { data } = await api.post<SendEmailResponse>('/notifications/email', payload);
    return { ok: true, data };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const status = axiosErr.response?.status ?? 0;
    const responseData = axiosErr.response?.data;

    if (status === 400) {
      // Backend sends { field: ["message", ...] } for validation errors
      const errors = (responseData ?? {}) as ValidationErrorResponse;
      return { ok: false, status: 400, errors };
    }

    if (status === 422) {
      const domainErr = responseData as DomainErrorResponse;
      return { ok: false, status: 422, message: domainErr?.message ?? 'Business rule violation.' };
    }

    // Fallback for 500, network errors, etc.
    return {
      ok: false,
      status,
      message:
        (responseData as { message?: string })?.message ??
        axiosErr.message ??
        'Unexpected error occurred.',
    };
  }
}

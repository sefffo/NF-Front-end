import api from '../../../api/axios';
import { AxiosError } from 'axios';

// ─── Request DTO (mirrors SendEmailNotificationCommand) ───────────────────────
export interface SendEmailRequest {
  tenantId: string;       // Required — the tenant making the request
  applicationId: string;  // Required — the application sending the email
  to: string[];           // Required, min 1 valid email address
  subject: string;        // Required, max 998 chars
  body: string;           // Required
  from?: string;          // Optional sender override
  isHtml?: boolean;       // Defaults to false
  idempotencyKey?: string; // Optional — prevents duplicate sends
}

// ─── Success Response ─────────────────────────────────────────────────────────
export interface SendEmailResponse {
  messageId: string;
  requestId: string;
  status: string;
}

// ─── Discriminated union returned by sendEmail() ─────────────────────────────
export type EmailApiResult =
  | { ok: true; data: SendEmailResponse }
  | { ok: false; status: 400; errors: Record<string, string[]> }
  | { ok: false; status: 422 | 403; title: string; detail: string }
  | { ok: false; status: number; message: string };

// ─── API call ─────────────────────────────────────────────────────────────────
export async function sendEmail(payload: SendEmailRequest): Promise<EmailApiResult> {
  try {
    const { data } = await api.post<SendEmailResponse>('/notifications/email', payload);
    return { ok: true, data };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const status = axiosErr.response?.status ?? 0;
    const responseData = axiosErr.response?.data as Record<string, unknown> | undefined;

    // 400 — ASP.NET Core ValidationProblemDetails: { errors: { FieldName: string[] } }
    if (status === 400) {
      const errors = (responseData?.['errors'] ?? {}) as Record<string, string[]>;
      return { ok: false, status: 400, errors };
    }

    // 422 or 403 — ASP.NET Core ProblemDetails: { title, detail }
    if (status === 422 || status === 403) {
      return {
        ok: false,
        status: status as 422 | 403,
        title: (responseData?.['title'] as string) ?? 'Business Error',
        detail: (responseData?.['detail'] as string) ?? 'An error occurred.',
      };
    }

    // Fallback — 401, 500, network errors
    return {
      ok: false,
      status,
      message:
        (responseData?.['detail'] as string) ??
        (responseData?.['title'] as string) ??
        axiosErr.message ??
        'Unexpected error occurred.',
    };
  }
}

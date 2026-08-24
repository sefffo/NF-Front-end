import api from '../../../api/axios';
import { AxiosError } from 'axios';

// ─── Request DTO (mirrors SendEmailRequestDto.cs) ────────────────────────────
// TenantId & ApplicationId are NOT sent — backend reads them from JWT claims.
export interface SendEmailRequest {
  to: string[];         // Required, min 1 address
  subject: string;      // Required, max 998 chars (RFC 5322)
  body: string;         // Required
  from?: string;        // Optional sender override
  isHtml?: boolean;     // Defaults to false (plain text)
  templateName?: string;
}

// ─── Success Response (mirrors SendEmailResponseDto.cs) ─────────────────────
export interface SendEmailResponse {
  messageId: string;
}

// ─── Discriminated union returned to callers ─────────────────────────────────
// 400  → ASP.NET Core ValidationProblem  { errors: { FieldName: string[] } }
// 422/403 → ASP.NET Core ProblemDetails  { title, detail }
// other   → generic fallback
export type EmailApiResult =
  | { ok: true;  data: SendEmailResponse }
  | { ok: false; status: 400;        errors: Record<string, string[]> }
  | { ok: false; status: 422 | 403;  title: string; detail: string }
  | { ok: false; status: number;     message: string };

// ─── POST /api/notifications/email ──────────────────────────────────────────
export async function sendEmail(payload: SendEmailRequest): Promise<EmailApiResult> {
  try {
    const { data } = await api.post<SendEmailResponse>('/notifications/email', payload);
    return { ok: true, data };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const status       = axiosErr.response?.status ?? 0;
    const responseData = axiosErr.response?.data as Record<string, unknown> | undefined;

    if (status === 400) {
      const errors = (responseData?.['errors'] ?? {}) as Record<string, string[]>;
      return { ok: false, status: 400, errors };
    }

    if (status === 422 || status === 403) {
      return {
        ok: false,
        status: status as 422 | 403,
        title:  (responseData?.['title']  as string) ?? 'Error',
        detail: (responseData?.['detail'] as string) ?? 'An error occurred.',
      };
    }

    return {
      ok: false,
      status,
      message:
        (responseData?.['detail'] as string) ??
        (responseData?.['title']  as string) ??
        axiosErr.message ??
        'Unexpected error occurred.',
    };
  }
}

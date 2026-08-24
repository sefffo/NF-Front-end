import { NotificationRecord, SendNotificationPayload } from '../../../types/notification';

export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'ntf_8801',
    tenantId: 'tnt_acme',
    applicationId: 'app_marketing_hub',
    applicationName: 'Acme Marketing Engine',
    channel: 'EMAIL',
    recipient: 'john.doe@example.com',
    subject: 'Summer Product Roadmap & Feature Updates',
    contentSnippet: 'Dear John, We are excited to announce our new Q3 releases...',
    status: 'DELIVERED',
    priority: 'MEDIUM',
    retryCount: 0,
    sentAt: '2026-08-12T23:15:10Z',
    createdAt: '2026-08-12T23:15:08Z',
  },
  {
    id: 'ntf_8802',
    tenantId: 'tnt_acme',
    applicationId: 'app_auth_alerts',
    applicationName: 'Acme Auth & Security Alerts',
    channel: 'SMS',
    recipient: '+1 (555) 234-5678',
    contentSnippet: 'Your Acme verification code is 492-109. Valid for 10 minutes.',
    status: 'DELIVERED',
    priority: 'URGENT',
    retryCount: 0,
    sentAt: '2026-08-12T23:30:02Z',
    createdAt: '2026-08-12T23:30:00Z',
  },
  {
    id: 'ntf_8803',
    tenantId: 'tnt_fintech',
    applicationId: 'app_paypulse_mobile',
    applicationName: 'PayPulse Mobile',
    channel: 'PUSH',
    recipient: 'fcm_token_device_abc123',
    subject: 'Payment Received',
    contentSnippet: 'You received $250.00 from Wire transfer ref #88192',
    status: 'DELIVERED',
    priority: 'HIGH',
    retryCount: 0,
    sentAt: '2026-08-12T23:40:00Z',
    createdAt: '2026-08-12T23:39:58Z',
  },
  {
    id: 'ntf_8804',
    tenantId: 'tnt_acme',
    applicationId: 'app_marketing_hub',
    applicationName: 'Acme Marketing Engine',
    channel: 'EMAIL',
    recipient: 'invalid-email-address',
    subject: 'Welcome to Acme Platform',
    contentSnippet: 'Welcome aboard! Verify your account link below...',
    status: 'FAILED',
    priority: 'LOW',
    errorMessage: 'SMTP response 550: Invalid recipient domain',
    retryCount: 3,
    createdAt: '2026-08-12T22:00:00Z',
  },
];

export const notificationsApi = {
  getNotifications: async (tenantId?: string): Promise<NotificationRecord[]> => {
    await new Promise((r) => setTimeout(r, 300));
    if (tenantId) {
      return MOCK_NOTIFICATIONS.filter((n) => n.tenantId === tenantId);
    }
    return MOCK_NOTIFICATIONS;
  },
  getNotificationById: async (id: string): Promise<NotificationRecord | undefined> => {
    return MOCK_NOTIFICATIONS.find((n) => n.id === id);
  },
  sendNotification: async (payload: SendNotificationPayload): Promise<NotificationRecord> => {
    const record: NotificationRecord = {
      id: 'ntf_' + Date.now(),
      tenantId: payload.tenantId,
      applicationId: payload.applicationId,
      applicationName: payload.applicationId === 'app_auth_alerts' ? 'Acme Auth Alerts' : 'Acme Marketing',
      channel: payload.channel,
      recipient: payload.recipient,
      subject: payload.subject,
      contentSnippet: payload.content.substring(0, 100) + (payload.content.length > 100 ? '...' : ''),
      status: payload.scheduledAt ? 'SCHEDULED' : 'DELIVERED',
      priority: payload.priority || 'MEDIUM',
      retryCount: 0,
      sentAt: payload.scheduledAt ? undefined : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    MOCK_NOTIFICATIONS.unshift(record);
    return record;
  },
};

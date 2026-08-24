export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';

export type NotificationStatus = 'QUEUED' | 'SENDING' | 'DELIVERED' | 'FAILED' | 'SCHEDULED';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface NotificationProviderConfig {
  id: string;
  tenantId: string;
  applicationId?: string;
  name: string;
  channel: NotificationChannel;
  providerType: 'TWILIO' | 'SENDGRID' | 'AWS_SES' | 'FIREBASE_FCM' | 'CUSTOM_WEBHOOK';
  isDefault: boolean;
  isActive: boolean;
  credentials: Record<string, string>;
  createdAt: string;
}

export interface SendNotificationPayload {
  tenantId: string;
  applicationId: string;
  channel: NotificationChannel;
  recipient: string; // email, phone number, push token, or webhook URL
  subject?: string;
  content: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
  priority?: NotificationPriority;
  scheduledAt?: string;
}

export interface NotificationRecord {
  id: string;
  tenantId: string;
  applicationId: string;
  applicationName: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  contentSnippet: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  errorMessage?: string;
  retryCount: number;
  sentAt?: string;
  createdAt: string;
}

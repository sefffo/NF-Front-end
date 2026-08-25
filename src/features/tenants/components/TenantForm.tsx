import React, { useState } from 'react';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { CreateTenantPayload } from '../../../types/tenant';

// ─── Validation constants ────────────────────────────────────────────────────────
const NAME_MAX_LENGTH = 100;

// ─── Validators ────────────────────────────────────────────────────────────────────
function validateName(value: string): string {
  if (!value.trim()) return 'Tenant name is required.';
  if (value !== value.trimStart()) return 'Name must not have leading whitespace.';
  if (value !== value.trimEnd()) return 'Name must not have trailing whitespace.';
  if (value.length > NAME_MAX_LENGTH) return `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  return '';
}

// ─── Types ──────────────────────────────────────────────────────────────────────────────
export interface TenantFormProps {
  initialValues?: Partial<CreateTenantPayload>;
  onSubmit: (values: CreateTenantPayload) => void;
  isLoading?: boolean;
  /** Server-side error message to display above the form (e.g. 403, 409, 400) */
  serverError?: string | null;
}

// ─── Component ─────────────────────────────────────────────────────────────────────────
export const TenantForm: React.FC<TenantFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  serverError,
}) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [maxApplications, setMaxApplications] = useState(
    initialValues?.settings?.maxApplications ?? 5
  );
  const [maxDailyNotifications, setMaxDailyNotifications] = useState(
    initialValues?.settings?.maxDailyNotifications ?? 50000
  );
  const [customDomain, setCustomDomain] = useState(initialValues?.settings?.customDomain ?? '');
  const [supportEmail, setSupportEmail] = useState(initialValues?.settings?.supportEmail ?? '');

  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────────────
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (nameTouched) setNameError(validateName(value));
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    setNameError(validateName(name));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    const nErr = validateName(name);
    setNameError(nErr);
    if (nErr) return;

    onSubmit({
      name: name.trim(),
      status: 'ACTIVE',
      settings: {
        maxApplications: Number(maxApplications),
        maxDailyNotifications: Number(maxDailyNotifications),
        allowedChannels: ['EMAIL', 'SMS', 'PUSH', 'WEBHOOK'],
        customDomain,
        supportEmail,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack" noValidate>
      {/* ─── Server-side error banner ─── */}
      {serverError && (
        <div role="alert" className="alert alert-error">
          <span>{serverError}</span>
        </div>
      )}

      <Input
        label="Tenant / Organization Name"
        value={name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        placeholder="e.g. Acme Corporation"
        error={nameError}
        maxLength={NAME_MAX_LENGTH}
        helperText={!nameError ? `${name.length} / ${NAME_MAX_LENGTH} characters` : undefined}
        required
      />

      <div className="form-grid-2col">
        <Input
          label="Max Allowed Applications"
          type="number"
          value={maxApplications}
          onChange={(e) => setMaxApplications(Number(e.target.value))}
          required
        />
        <Input
          label="Max Daily Notifications"
          type="number"
          value={maxDailyNotifications}
          onChange={(e) => setMaxDailyNotifications(Number(e.target.value))}
          required
        />
      </div>

      <div className="form-grid-2col">
        <Input
          label="Custom Domain (Optional)"
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value)}
          placeholder="notifications.acme.com"
        />
        <Input
          label="Support Email"
          type="email"
          value={supportEmail}
          onChange={(e) => setSupportEmail(e.target.value)}
          placeholder="support@acme.com"
        />
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save Tenant Configuration
        </Button>
      </div>
    </form>
  );
};

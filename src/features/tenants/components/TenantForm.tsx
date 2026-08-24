import React, { useState } from 'react';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { CreateTenantPayload } from '../../../types/tenant';

// ─── Validation constants ────────────────────────────────────────────────────
const NAME_MAX_LENGTH = 100;
const SLUG_MAX_LENGTH = 50;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─── Validators ──────────────────────────────────────────────────────────────
function validateName(value: string): string {
  if (!value) return 'Tenant name is required.';
  if (value !== value.trimStart()) return 'Name must not have leading whitespace.';
  if (value !== value.trimEnd()) return 'Name must not have trailing whitespace.';
  if (!value.trim()) return 'Name cannot be only spaces.';
  if (value.length > NAME_MAX_LENGTH) return `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  return '';
}

function validateSlug(value: string): string {
  if (!value) return 'Slug (code) is required.';
  if (value.length > SLUG_MAX_LENGTH) return `Slug must be ${SLUG_MAX_LENGTH} characters or fewer.`;
  if (!SLUG_PATTERN.test(value))
    return 'Slug must be lowercase alphanumeric with hyphens only (e.g. acme-corp).';
  return '';
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface TenantFormProps {
  initialValues?: Partial<CreateTenantPayload>;
  onSubmit: (values: CreateTenantPayload) => void;
  isLoading?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const TenantForm: React.FC<TenantFormProps> = ({ initialValues, onSubmit, isLoading = false }) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [slug, setSlug] = useState(initialValues?.slug || '');
  const [maxApplications, setMaxApplications] = useState(initialValues?.settings?.maxApplications || 5);
  const [maxDailyNotifications, setMaxDailyNotifications] = useState(
    initialValues?.settings?.maxDailyNotifications || 50000
  );
  const [customDomain, setCustomDomain] = useState(initialValues?.settings?.customDomain || '');
  const [supportEmail, setSupportEmail] = useState(initialValues?.settings?.supportEmail || '');

  // Per-field error state — only shown after blur or a failed submit attempt
  const [nameError, setNameError] = useState('');
  const [slugError, setSlugError] = useState('');
  const [touched, setTouched] = useState({ name: false, slug: false });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) setNameError(validateName(value));

    // Auto-derive slug from name when slug is empty
    if (!slug) {
      const derived = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      if (touched.slug) setSlugError(validateSlug(derived));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Normalize: always lowercase, strip any character that isn't alphanumeric or hyphen
    const normalized = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    setSlug(normalized);
    if (touched.slug) setSlugError(validateSlug(normalized));
  };

  const handleNameBlur = () => {
    setTouched((t) => ({ ...t, name: true }));
    setNameError(validateName(name));
  };

  const handleSlugBlur = () => {
    setTouched((t) => ({ ...t, slug: true }));
    setSlugError(validateSlug(slug));
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all validated fields as touched so errors become visible
    setTouched({ name: true, slug: true });

    const finalSlug = slug || name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const nErr = validateName(name);
    const sErr = validateSlug(finalSlug);

    setNameError(nErr);
    setSlugError(sErr);

    // Block submission if any field is invalid
    if (nErr || sErr) return;

    onSubmit({
      name: name.trim(),
      slug: finalSlug,
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

      <Input
        label="Slug Identifier"
        value={slug}
        onChange={handleSlugChange}
        onBlur={handleSlugBlur}
        placeholder="e.g. acme-corp"
        error={slugError}
        maxLength={SLUG_MAX_LENGTH}
        helperText={
          !slugError
            ? `${slug.length} / ${SLUG_MAX_LENGTH} · lowercase alphanumeric and hyphens only`
            : undefined
        }
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

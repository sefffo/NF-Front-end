import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

// These match the seeded accounts in DatabaseSeeder.cs
const DEMO_CREDENTIALS = [
  { label: 'Super Admin',   email: 'admin@system.com',        password: 'Admin@1234', hint: 'Full system access' },
  { label: 'Tenant Admin',  email: 'tenantadmin@system.com',  password: 'Admin@1234', hint: 'Manages one tenant' },
  { label: 'End User',      email: 'user@system.com',         password: 'Admin@1234', hint: 'View & send only' },];

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

const [email, setEmail]           = useState('admin@system.com');
  const [password, setPassword]     = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted]       = useState(false);
  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
await login({ email: email.trim(), password });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      // Surface the backend error message when available
      const axiosErr = err as { response?: { data?: { message?: string; title?: string; detail?: string } } };
      const msg =
        axiosErr?.response?.data?.detail ??
        axiosErr?.response?.data?.message ??
        axiosErr?.response?.data?.title ??
        null;
      setError(msg ?? 'Invalid credentials. Please check your email and password.');    } finally {
      setIsLoading(false);
    }
  };

// Auto-fill both email and correct password from the seeded account
  const handleDemoSelect = (cred: typeof DEMO_CREDENTIALS[number]) => {
    setEmail(cred.email);
    setPassword(cred.password);    setError('');
  };

  return (
    <div className="lp-backdrop">
      <div className={`lp-card ${mounted ? 'lp-card--visible' : ''}`}>

        {/* ── Left: Image Panel ── */}
        <div className="lp-image-panel">
          <div className="lp-image-top-label">Notification Service</div>
          <img src="/login-bg.jpg" alt="Night canyon landscape" className="lp-image" />
          <div className="lp-image-bottom">
            <span className="lp-by">By</span>
            <span className="lp-author">AZKA</span>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="lp-form-panel">
          <div className="lp-form-header">
            <p className="lp-welcome-line">
              Welcome <span className="lp-welcome-accent">Back !</span>
            </p>
            <h1 className="lp-title">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="lp-form" noValidate>
            {/* Email */}
            <div className="lp-field-wrap">
              <input
                id="login-email"
                type="email"
                className="lp-field"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="Email"
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div className="lp-field-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="lp-field"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="lp-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
{showPassword ? '\uD83D\uDE48' : '\uD83D\uDC41'}              </button>
            </div>

            {/* Forget password link */}
            <div className="lp-forgot-row">
              <button type="button" className="lp-forgot-link">Forget Password ?</button>
            </div>

            {/* Error */}
            {error && (
              <div className="lp-error" role="alert">
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              className={`lp-submit ${isLoading ? 'lp-submit--loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="lp-spinner" />
              ) : (
                <>
                  Login
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Quick-Login */}
          <div className="lp-demo-section">
            <div className="lp-demo-divider">
              <span>Quick demo access</span>
            </div>
            <div className="lp-demo-cards">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  className={`lp-demo-card ${email === cred.email ? 'lp-demo-card--active' : ''}`}
onClick={() => handleDemoSelect(cred)}                >
                  <span className="lp-demo-label">{cred.label}</span>
                  <span className="lp-demo-hint">{cred.hint}</span>
                </button>
              ))}
            </div>
            <p className="lp-demo-note">
Click a role to auto-fill credentials.            </p>
          </div>
        </div>

      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

<<<<<<< HEAD
// These match the seeded accounts in DatabaseSeeder.cs
const DEMO_CREDENTIALS = [
  { label: 'Super Admin',   email: 'admin@system.com',        password: 'Admin@1234', hint: 'Full system access' },
  { label: 'Tenant Admin',  email: 'tenantadmin@system.com',  password: 'Admin@1234', hint: 'Manages one tenant' },
  { label: 'End User',      email: 'user@system.com',         password: 'Admin@1234', hint: 'View & send only' },
=======
const DEMO_CREDENTIALS = [
  { label: 'Super Admin', email: 'admin@notifications.io', hint: 'Full system access' },
  { label: 'Tenant Admin', email: 'tenant@acme.io', hint: 'Manages one tenant' },
  { label: 'End User', email: 'user@acme.io', hint: 'View & send only' },
>>>>>>> develop
];

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

<<<<<<< HEAD
  const [email, setEmail]           = useState('admin@system.com');
  const [password, setPassword]     = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted]       = useState(false);
=======
  const [email, setEmail] = useState('admin@notifications.io');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
>>>>>>> develop

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
<<<<<<< HEAD
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
      setError(msg ?? 'Invalid credentials. Please check your email and password.');
=======
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Invalid credentials. Please try again.');
>>>>>>> develop
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  // Auto-fill both email and correct password from the seeded account
  const handleDemoSelect = (cred: typeof DEMO_CREDENTIALS[number]) => {
    setEmail(cred.email);
    setPassword(cred.password);
=======
  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
>>>>>>> develop
    setError('');
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
<<<<<<< HEAD
                {showPassword ? '\uD83D\uDE48' : '\uD83D\uDC41'}
=======
                {showPassword ? '🙈' : '👁'}
>>>>>>> develop
              </button>
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
<<<<<<< HEAD
                  onClick={() => handleDemoSelect(cred)}
=======
                  onClick={() => handleDemoSelect(cred.email)}
>>>>>>> develop
                >
                  <span className="lp-demo-label">{cred.label}</span>
                  <span className="lp-demo-hint">{cred.hint}</span>
                </button>
              ))}
            </div>
            <p className="lp-demo-note">
<<<<<<< HEAD
              Click a role to auto-fill credentials.
=======
              Click a role to auto-fill. Password: <code>demo1234</code>
>>>>>>> develop
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

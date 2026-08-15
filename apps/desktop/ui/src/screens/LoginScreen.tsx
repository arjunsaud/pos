import { useState } from 'react';
import type { DesktopRole } from '../lib/types';

export function LoginScreen({
  onSubmit,
  error,
  busy,
  challengeEmail,
}: {
  onSubmit: (email: string, password: string, role: DesktopRole, otp?: string) => void;
  error: string;
  busy: boolean;
  challengeEmail?: string;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<DesktopRole>('tenant-admin');
  const [otp, setOtp] = useState('');

  return (
    <div className="login">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(email, password, role, challengeEmail ? otp : undefined);
        }}
      >
        <div className="brand">
          <div className="logo">P</div>
          <div>
            <h1>POS Nepal</h1>
            <p className="sub" style={{ margin: 0 }}>Desktop</p>
          </div>
        </div>
        <p className="sub">Sign in as tenant admin or staff. Super admin is web-only.</p>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required={!challengeEmail} />
        </div>
        {challengeEmail ? (
          <div className="field">
            <label htmlFor="otp">2FA code sent to {challengeEmail}</label>
            <input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
        ) : null}
        <div className="roles">
          <button type="button" className={`role ${role === 'tenant-admin' ? 'on' : ''}`} onClick={() => setRole('tenant-admin')}>
            <strong>Tenant Admin</strong>
            <span>Dashboard, inventory, reports</span>
          </button>
          <button type="button" className={`role ${role === 'staff' ? 'on' : ''}`} onClick={() => setRole('staff')}>
            <strong>Staff</strong>
            <span>POS and sales history</span>
          </button>
        </div>
        <p className="error">{error}</p>
        <button className="primary" type="submit" disabled={busy || !email || !password || Boolean(challengeEmail && !otp)}>
          {busy ? 'Signing in…' : challengeEmail ? 'Verify code' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

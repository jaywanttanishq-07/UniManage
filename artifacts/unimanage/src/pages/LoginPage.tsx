import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MeshBackground from '../components/MeshBackground';

export default function LoginPage() {
  const { login } = useAuth();
  const [id, setId]           = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [shaking, setShaking] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);

  useEffect(() => { idRef.current?.focus(); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const ok = login(id.trim(), password);
    if (!ok) {
      setError('Incorrect ID or password. Please try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="login-root">
      <MeshBackground />
      <div className={`login-card${shaking ? ' login-shake' : ''}`}>
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-mark">UM</div>
        </div>
        <h1 className="login-title">UniManage</h1>
        <p className="login-subtitle">University Management System</p>
        <p className="login-hint">Sign in to access the admin panel</p>

        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <div className="login-field">
            <label htmlFor="login-id">Admin ID</label>
            <input
              ref={idRef}
              id="login-id"
              type="text"
              value={id}
              onChange={e => { setId(e.target.value); setError(''); }}
              placeholder="Enter your admin ID"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-pw">Password</label>
            <div className="login-pw-wrap">
              <input
                id="login-pw"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit" className="login-btn">
            Sign In →
          </button>
        </form>

        <p className="login-default-hint">
          Default: ID&nbsp;<strong>admin</strong> / Password&nbsp;<strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}

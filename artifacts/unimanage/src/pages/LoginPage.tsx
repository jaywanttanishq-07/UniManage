import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeshBackground from '../components/MeshBackground';
import { useAuth, type UserRole } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('admin');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (login(role, id, password)) {
      navigate('/dashboard');
      return;
    }
    setError('ID or password is incorrect for this sign-in type.');
  }

  return (
    <main className="login-root">
      <MeshBackground />
      <section className="login-card">
        <div className="login-logo"><div className="logo-mark">UM</div></div>
        <h1 className="login-title">UniManage</h1>
        <p className="login-subtitle">University Management System</p>

        <div className="login-role-picker" aria-label="Choose sign-in type">
          {(['admin', 'teacher'] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={role === option ? 'btn-gold' : 'btn-muted'}
              onClick={() => { setRole(option); setError(''); }}
            >
              {option === 'admin' ? 'Administration' : 'Teacher'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-id">{role === 'admin' ? 'Admin ID' : 'Teacher ID'}</label>
            <input
              id="login-id"
              value={id}
              onChange={(event) => { setId(event.target.value); setError(''); }}
              autoComplete="username"
              required
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(''); }}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-btn">Sign In</button>
        </form>

        {import.meta.env.DEV && (
          <p className="login-default-hint">
            Local demo: admin / admin123 · teacher / teacher123
          </p>
        )}
      </section>
    </main>
  );
}

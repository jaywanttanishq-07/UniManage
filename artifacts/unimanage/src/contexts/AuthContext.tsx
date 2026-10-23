import { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'teacher';

type Account = { id: string; password: string };
type Accounts = Record<UserRole, Account>;

const ACCOUNTS_KEY = 'um-accounts';
const SESSION_KEY = 'um-auth-session';

const DEFAULT_ACCOUNTS: Accounts = {
  admin: { id: 'admin', password: 'admin123' },
  teacher: { id: 'teacher', password: 'teacher123' },
};

export const STUDENT_ROUTES = [
  '/students',
  '/courses',
  '/timetable',
  '/exams',
  '/notices',
  '/library',
];

const TEACHER_ROUTES = [
  '/dashboard',
  '/students',
  '/teachers',
  '/courses',
  '/departments',
  '/timetable',
  '/exams',
  '/results',
  '/notices',
  '/attendance',
  '/library',
];

export function canAccessRoute(role: UserRole | null, path: string) {
  if (role === 'admin') return true;
  if (role === 'teacher') return TEACHER_ROUTES.includes(path);
  return STUDENT_ROUTES.includes(path);
}

function loadAccounts(): Accounts {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (saved) return { ...DEFAULT_ACCOUNTS, ...JSON.parse(saved) };

    // Keep credentials made by the earlier single-admin demo login.
    const old = localStorage.getItem('um-auth-creds');
    if (old) {
      const admin = JSON.parse(old) as Account;
      return { ...DEFAULT_ACCOUNTS, admin };
    }
  } catch {
    // Use the local demo accounts if browser storage is unavailable.
  }
  return DEFAULT_ACCOUNTS;
}

function loadSession(): UserRole | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved === 'admin' || saved === 'teacher') return saved;
    return saved === 'true' ? 'admin' : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  role: UserRole | null;
  userId: string;
  login: (role: UserRole, id: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (
    accountRole: UserRole,
    currentPassword: string,
    newId: string,
    newPassword: string,
  ) => string | null;
}

const AuthContext = createContext<AuthContextValue>({
  role: null,
  userId: '',
  login: () => false,
  logout: () => {},
  updateCredentials: () => 'Not signed in.',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(loadSession);
  const [userId, setUserId] = useState(() => {
    const activeRole = loadSession();
    return activeRole ? loadAccounts()[activeRole].id : '';
  });

  function login(accountRole: UserRole, id: string, password: string) {
    const account = loadAccounts()[accountRole];
    if (id.trim() !== account.id || password !== account.password) return false;

    localStorage.setItem(SESSION_KEY, accountRole);
    setRole(accountRole);
    setUserId(account.id);
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setRole(null);
    setUserId('');
  }

  function updateCredentials(
    accountRole: UserRole,
    currentPassword: string,
    newId: string,
    newPassword: string,
  ) {
    if (!role) return 'Sign in to change credentials.';
    if (role !== accountRole && role !== 'admin') return 'You cannot change this account.';
    if (currentPassword !== loadAccounts()[role].password) return 'Current password is incorrect.';
    if (!newId.trim()) return 'ID cannot be empty.';
    if (newPassword.length < 8) return 'Use a password with at least 8 characters.';

    const accounts = loadAccounts();
    accounts[accountRole] = { id: newId.trim(), password: newPassword };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    if (role === accountRole) setUserId(newId.trim());
    return null;
  }

  return (
    <AuthContext.Provider value={{ role, userId, login, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

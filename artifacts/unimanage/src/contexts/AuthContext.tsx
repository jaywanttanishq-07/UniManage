import { createContext, useContext, useState, useEffect } from 'react';

const CREDS_KEY   = 'um-auth-creds';
const SESSION_KEY = 'um-auth-session';

interface Credentials { id: string; password: string; }
interface AuthContextValue {
  isLoggedIn: boolean;
  adminId: string;
  login: (id: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (currentPassword: string, newId: string, newPassword: string) => string | null;
}

const DEFAULT_CREDS: Credentials = { id: 'admin', password: 'admin123' };

function loadCreds(): Credentials {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) return DEFAULT_CREDS;
    return JSON.parse(raw) as Credentials;
  } catch { return DEFAULT_CREDS; }
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  adminId: '',
  login: () => false,
  logout: () => {},
  updateCredentials: () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try { return localStorage.getItem(SESSION_KEY) === 'true'; } catch { return false; }
  });
  const [adminId, setAdminId] = useState<string>(() => loadCreds().id);

  // Keep adminId in sync if credentials change elsewhere
  useEffect(() => { setAdminId(loadCreds().id); }, [isLoggedIn]);

  function login(id: string, password: string): boolean {
    const creds = loadCreds();
    if (id.trim() === creds.id && password === creds.password) {
      localStorage.setItem(SESSION_KEY, 'true');
      setIsLoggedIn(true);
      setAdminId(creds.id);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  }

  /**
   * Updates credentials. Returns an error string on failure, null on success.
   * Requires the current password to confirm identity.
   */
  function updateCredentials(currentPassword: string, newId: string, newPassword: string): string | null {
    const creds = loadCreds();
    if (currentPassword !== creds.password) return 'Current password is incorrect.';
    if (!newId.trim()) return 'ID cannot be empty.';
    if (newPassword.length < 6) return 'New password must be at least 6 characters.';
    const updated: Credentials = { id: newId.trim(), password: newPassword };
    localStorage.setItem(CREDS_KEY, JSON.stringify(updated));
    setAdminId(updated.id);
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, adminId, login, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }

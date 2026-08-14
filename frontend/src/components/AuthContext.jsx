import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`${API}/auth/me`, { credentials: "include" });
      if (!response.ok) throw new Error("Not signed in");
      setUser(await response.json());
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (window.location.hash?.includes("session_id=")) { setLoading(false); return; }
    refreshUser();
  }, [refreshUser]);

  const login = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/app/discovery";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  const logout = async () => { await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" }); setUser(null); };
  const value = useMemo(() => ({ user, loading, login, logout, refreshUser, setUser }), [user, loading, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
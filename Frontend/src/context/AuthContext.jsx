import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  useEffect(() => {
    const handleStorage = () => {
      setAuthState({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      });
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setAuth = ({ token, role }) => {
    if (token) localStorage.setItem("token", token);
    if (role) localStorage.setItem("role", role);
    setAuthState({ token, role });
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthState({ token: null, role: null });
  };

  const value = useMemo(
    () => ({ ...auth, setAuth, clearAuth }),
    [auth.token, auth.role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

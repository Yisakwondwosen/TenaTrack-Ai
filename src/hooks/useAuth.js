/**
 * React hook for authentication state management
 * Provides useAuth() and logout() methods
 */

import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current auth state on mount
  useEffect(() => {
    async function fetchAuthState() {
      try {
        const response = await axios.get("/api/auth/state");
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthState();
  }, []);

  // Logout method
  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
  };

  return {
    user,
    loading,
    logout,
  };
}

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(Cookies.get("role") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("role"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/status`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
          setIsAuthenticated(true);
          Cookies.set("role", data.role, { secure: true, sameSite: "Strict" });
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          Cookies.remove("role");
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
        Cookies.remove("role");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (accessToken, role) => {
    Cookies.set("accessToken", accessToken, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("role", role, { secure: true, sameSite: "Strict" });

    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    Cookies.remove("accessToken");
    Cookies.remove("role");

    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ userRole, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

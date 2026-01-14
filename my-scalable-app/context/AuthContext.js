"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (userData) => {
    setUser(userData); // Usually you'd store a JWT token here
    localStorage.setItem("isLoggedIn", "true");
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser && user) {
        // User removed from localStorage, update context
        setUser(null);
      } else if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user)) {
        // User changed in localStorage, update context
        setUser(storedUser);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

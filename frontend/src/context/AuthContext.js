import React, { createContext, useContext, useState } from 'react';
import { login, register } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
const handleLogin = async (email, password) => {
  const loggedInUser = await login(email, password);
  if (loggedInUser) {
    setUser(loggedInUser); // This should update the user state
  }
};


  const handleRegister = async (username, email, password) => {
    const newUser = await register(username, email, password);
    setUser(newUser);
    return newUser;
  };

  const handleLogout = () => {
    setUser(null);
    // Add any additional logout logic (like clearing tokens)
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

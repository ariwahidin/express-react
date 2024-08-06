import React, { createContext, useState, useContext, useEffect } from 'react';
import CryptoJS from 'crypto-js';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);


  const login = ({ user, token, refreshToken }) => {
    const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), process.env.REACT_APP_SECRET_KEY).toString();
    setUser(user);
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem('py_pos_token_access', token);
    localStorage.setItem('py_pos_token_access_refresh', refreshToken);
    localStorage.setItem('py_pos_user', encryptedUser);
  }

  

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('py_pos_token_access_refresh');
    localStorage.removeItem('py_pos_token_access');
    localStorage.removeItem('py_pos_user');
  };

  const value = {
    user,
    token,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


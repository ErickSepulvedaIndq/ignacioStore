/*
* este contexto maneja la autenticación del usuario, su información y el estado de la barra lateral
* por ahora, el login es simulado y siempre retorna un usuario admin para facilitar el desarrollo
* por que falta la parte del back, asi que quedara asi un tiempo
*/
import { createContext, useContext, useState } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const login = async (userData) => {
    try {
      const response = await authService(userData);
      console.log(response);

      const token = response.data

      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem("username", payload.username);
      localStorage.setItem("role", payload.role);
      localStorage.setItem("id", payload.userId);

      setUser(payload);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
  };

  const isAdmin = () => {
    if(localStorage.getItem('role') === 'admin') {
      return true;
    }
    return false;
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const toggleSideNav = () => {
    setIsSideNavOpen((prev) => !prev);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  const value = {
    user,
    isSideNavOpen,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    toggleSideNav,
    closeSideNav,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

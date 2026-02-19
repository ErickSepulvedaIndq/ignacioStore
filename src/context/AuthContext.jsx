/*
* este contexto maneja la autenticación del usuario, su información y el estado de la barra lateral
* por ahora, el login es simulado y siempre retorna un usuario admin para facilitar el desarrollo
* por que falta la parte del back, asi que quedara asi un tiempo

 * Cambios:
 * - Se agregó userId al objeto user y localStorage
 *   El userId es necesario para obtener las compras específicas del usuario en la página "Mis Compras"
 * - Ahora al hacer login, se extrae userId del JWT y se guarda en localStorage
 * - El objeto user ahora contiene: { userId, username, role }
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

      const token = response.data;

      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem("username", payload.username);
      localStorage.setItem("userId", payload.userId);
      localStorage.setItem("role", payload.role);

      setUser({
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setUser(null);
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

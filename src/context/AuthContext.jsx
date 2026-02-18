/*
* este contexto maneja la autenticación del usuario, su información y el estado de la barra lateral
* por ahora, el login es simulado y siempre retorna un usuario admin para facilitar el desarrollo
* por que falta la parte del back, asi que quedara asi un tiempo
*/
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // pues de momento no esta listo el JWT
  const [user] = useState({
    id: 1,
    firstName: 'Admin',
    lastName: 'Kristal',
    role: 'admin',
  });

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const login = (userData) => {
    if (!userData) return;
    if (userData.role === 'admin') {
      isAdmin()
    }
    // TODO: Impletar JWT
    console.log('Login pendiente de implementar', userData);
  };

  const logout = () => {
    localStorage.removeItem('cart_INDQ');
    // TODO: tambien debe olviar el JWT por que ahi vienen sus permisos IMPORTANTE
    // localStorage.removeItem('cart_INDQ');
    
  };

  const isAdmin = () => {
    // ps de momento siempre retorna true
    return true;
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

/*
* este contexto maneja la autenticación del usuario, su información y el estado de la barra lateral
* por ahora, el login es simulado y siempre retorna un usuario admin para facilitar el desarrollo
* por que falta la parte del back, asi que quedara asi un tiempo
*/
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { showToast } from '../components/UI/toast';
import { useAuthLogin } from '../api/hooks/authHooks';

const AuthContext = createContext();

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { mutateAsync: authLogin } = useAuthLogin();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  });
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const logout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/login', { replace: true });
  };

  const startTokenTimer = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = (decoded.exp - currentTime) * 1000;

      if (timeLeft <= 0) {
        logout();
      } else {
        const timer = setTimeout(() => {
          Swal.fire({
            title: "Sesión expirada",
            text: "Tu sesión ha expirado.",
            icon: "info"
          }).then(() => logout());
        }, timeLeft);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error(error)
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      startTokenTimer(token);
    }
  }, [user]);

  const login = async (userData) => {
    try {
      const response = await authLogin({ data: userData });
      const token = response.data;

      localStorage.setItem("token", token);
      const payload = parseJwt(token);
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
      if (error.response.status === 404) {
        showToast({
          icon: "error",
          title: "Credenciales incorrectas.",
          position: "top-right",
          timer: 1800,
        });
      } else {
        showToast({
          icon: "error",
          title: "Ha ocurrido un error inesperado intente más tarde.",
          position: "top-right",
          timer: 1800,
        });
      }
      return false;
    }
  };


  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    }
    window.addEventListener('sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('sessionExpired', handleSessionExpired);
  }, [navigate])

  const isAdmin = () => {
    if (localStorage.getItem('role') === 'admin') {
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

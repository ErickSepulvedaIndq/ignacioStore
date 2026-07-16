import axios from "axios";
import Swal from "sweetalert2";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const serverMessage = error.response.data.message;

      if (serverMessage === "Sesión expirada") {
        if (Swal.isVisible()) return;
        Swal.fire({
            title: "Sesión expirada",
            text: "Tu sesión ha expirado, por favor inicia sesión nuevamente",
            icon: "warning",
            confirmButtonColor: "#3041A0",
            confirmButtonText: "Aceptar"
        }).then(() => {
            window.dispatchEvent(new Event('sessionExpired'));
        });
      }
    }
    return Promise.reject(error);
  }
);

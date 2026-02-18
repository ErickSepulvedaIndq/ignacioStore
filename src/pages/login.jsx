import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (selectedRole) => {
    // esto es temporal
    const testUser = {
      id: 1,
      firstName: "Kristal",
      lastName: "Guzman",
      role: selectedRole,
    };

    login(testUser);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-[#3041A0] mb-6">
          IGNACIO STORE
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Elige un rol para continuar
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("user")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Entrar como Usuario
          </button>

          <button
            onClick={() => handleLogin("admin")}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Entrar como Administrador
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          * Simulacion aun falta verificar las credenciales
        </p>
      </div>
    </div>
  );
}

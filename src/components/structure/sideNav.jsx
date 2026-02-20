import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SideNav() {
  const { user, isAdmin, isSideNavOpen, closeSideNav, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role || localStorage.getItem("role");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3041A0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };


  // esto es para los users unicamente osea basico
  const userMenuItems = [
    { path: "/products", label: "Productos", icon: "pi pi-shopping-bag" },
    { path: "/purchases", label: "Mis Compras", icon: "pi pi-credit-card" },
  ];

  // permisos de admin
  const adminMenuItems = [
    {
      path: "/admin/users",
      label: "Administrar Usuarios",
      icon: "pi pi-users",
    },
    {
      path: "/admin/products",
      label: "Administrar Productos",
      icon: "pi pi-box",
    },
    {
      path: "/admin/debtors",
      label: "Pendientes de Pago",
      icon: "pi pi-exclamation-triangle",
    },
    {
      path: "/admin/reports",
      label: "Generar Reporte",
      icon: "pi pi-file-export",
    },
  ];

  return (
    <>
      {/* con esto al seleccionar fuera del sidenav se cerrara*/}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ${
          isSideNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSideNav}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-70 bg-[#3041A0] text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="bg-[#25327D] p-6 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl">INDQNACIO STORE</h2>
              {user && (
                <p className="text-sm text-gray-300 mt-1">
                  {user.username}
                  <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">
                    {role.toUpperCase()}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={closeSideNav}
              className="text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-145 hover:text-red-400 active:scale-100"
            >
              ×
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {/* Sección Usuario */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
                Usuario
              </h3>
              <ul className="space-y-1">
                {userMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeSideNav}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                        isActive(item.path)
                          ? "bg-[#25327D] font-semibold"
                          : "hover:bg-[#25327D]/50"
                      }`}
                    >
                      <i className={`${item.icon} text-lg`}></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* seccion de amins */}
            {isAdmin() && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
                  Administrador
                </h3>
                <ul className="space-y-1">
                  {adminMenuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={closeSideNav}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                          isActive(item.path)
                            ? "bg-[#25327D] font-semibold"
                            : "hover:bg-[#25327D]/50"
                        }`}
                      >
                        <i className={`${item.icon} text-lg`}></i>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>

          {/* por alguna razon el logout falla */}
          <div className="border-t border-[#25327D] p-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="pi pi-sign-out"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

import { useState } from "react";
import LogoINDQ from '../../assets/indq2.png';
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProfilePhotoComponent from "../UI/ProfilePhotoComponent";

const Sidebar = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();


    const [isOpen, setIsOpen] = useState(
        () => window.matchMedia("(min-width: 1024px)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const handleChange = (e) => setIsOpen(e.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // permisos usuario
    const userMenuItems = [
        { path: "/products", label: "Productos", icon: "pi pi-shopping-bag" },
        { path: "/purchases", label: "Mis Compras", icon: "pi pi-credit-card" },
        { path: "/settings", label: "Configuraciones", icon: "pi pi-cog" },
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
            path: "/admin/purchaseHistory",
            label: "Historial de Compras",
            icon: "pi pi-book",
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

    const NavLinkComponent = ({ path, icon, label, onClick, title }) => {
        return (
            <NavLink
                to={path}
                onClick={onClick}
                title={title}
                className={({ isActive }) => ` overflow-hidden rounded py-2 px-2.5 flex flex-row gap-4 items-center
                ${isActive ? "bg-white font-bold text-blue-800" : "font-semibold text-white hover:scale-105 transition ease-in-out"}`}
            >
                <i className={`${icon} text-lg`}></i>
                <span className="text-base">{label}</span>
            </NavLink>
        )
    }

    const handleLogout = () => {
        Swal.fire({
            title: "¿Está seguro que desea salir?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1c398e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Salir",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate("/login");
            }
        });
    }

    const handleOnClick = () => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        if (!mediaQuery.matches) setIsOpen(close)
    }

    return (
        <>
            <div className={`group flex flex-col justify-between absolute md:static md:h-auto h-full z-50 ${isOpen ? "w-70 overflow-x-hidden" : "w-0 md:w-20 "} 
                        transition-all ease-in-out duration-200  
                            bg-blue-900 border-r border-slate-500 rounded`}>

                <div>
                    {/* Cabecera */}
                    <div className="h-20 md:h-25 border-b border-slate-500 w-full relative bg-blue-900 flex justify-center items-center">

                        {/* botón barra abierta */}
                        <button
                            className={`${isOpen ? "absolute" : "hidden!"} pi pi-angle-left -right-3.5 md:-right-10 md:group-hover:-right-3.5 pl-1 pr-3 py-2 rounded-full flex justify-center items-center  shadow-custom-xl 
                        cursor-pointer hover:scale-105 transition-all ease-in-out font-bold bg-white/90`}
                            onClick={() => setIsOpen(!isOpen)}
                        ></button>

                        {/* botón barra cerrada */}
                        <div className={`-right-5 ${!isOpen ? "absolute" : "hidden!"}`}>
                            <div className="relative w-5 h-8 overflow-hidden ">
                                <button
                                    className="absolute right-0 bg-white/90 rounded-full pr-1 pl-3 py-2 cursor-pointer 
                            pi pi-angle-right hover:bg-white"
                                    title="Abrir sidebar"
                                    onClick={() => setIsOpen(!isOpen)}
                                ></button>
                            </div>
                        </div>

                        <div className="text-white overflow-hidden whitespace-nowrap w-full h-full flex flex-row gap-2 items-center">
                            <div className={`${isOpen ? "w-6 md:w-10" : "md:w-1"} md:shrink-0 h-full transition-all duration-200`}></div>

                            <img
                                className="h-11 md-11 md:h-13 md:shrink-0 md:w-13 bg-white rounded-full p-1"
                                src={LogoINDQ}
                                alt=""
                            />

                            <div
                                className={`flex flex-col overflow-hidden transition-all duration-200 ${isOpen ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
                                    }`}
                            >
                                <h1 className="font-bold text-lg md:text-xl italic text-shadow-lg">INDQNACIO</h1>
                                <h2 className="font-bold text-lg md:text-xl text-shadow-lg italic">STORE</h2>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="overflow-hidden mt-5">
                        {/* Sección Usuario */}
                        <div className="mb-6">
                            <h3 className={`text-xs ${isOpen ? "text-start pl-5" : "text-center"} font-semibold w-full text-gray-400 uppercase mb-2 px-2`}>
                                Usuario
                            </h3>
                            <ul className="whitespace-nowrap ">
                                {userMenuItems.map((item) => (
                                    <li key={item.path} className="px-5 pb-3">
                                        {/* {JSON.stringify(item)} */}
                                        <NavLinkComponent title={item.label} path={item.path} icon={item.icon} label={item.label} onClick={handleOnClick} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* sección de admins */}
                        {isAdmin() && (
                            <div className="mb-6">
                                <h3 className={`text-xs ${isOpen ? "text-start pl-5" : "text-center"} font-semibold w-full text-gray-400 uppercase mb-2 px-2`}>
                                    {isOpen ? "Administrador" : "Admin"}
                                </h3>
                                <ul className="whitespace-nowrap ">
                                    {adminMenuItems.map((item) => (
                                        <li key={item.path} className="px-5 pb-3">
                                            <NavLinkComponent title={item.label} path={item.path} icon={item.icon} label={item.label} onClick={handleOnClick} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* footer */}
                <div className={`overflow-hidden flex flex-row gap-4 justify-center items-center mb-4`}>
                    <div className="flex flex-row justify-center items-center gap-2 p-4">
                        <ProfilePhotoComponent size={'h-14 w-14'} />
                        <div className={`flex flex-col p-1 justify-center items-center gap-1 ${isOpen ? "" : "hidden!"}`}>
                            <p className="text-xs text-white font-bold max-w-25 truncate">{user.username}</p>
                            <h1 className={`rounded p-1 text-xs font-bold text-center w-fit uppercase text-white shadow-custom
                            ${isAdmin() ? "bg-yellow-600 " : "bg-blue-600"}`}>
                                {user.role}
                            </h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Cerrar session"
                            style={{ fontWeight: 'bold', fontSize: '1.25rem' }}
                            className={`bg-whitee pi pi-sign-out hover:scale-110 hover:bg-red-700 text-white 
                            hover:text-white py-2 px-3 rounded  transition cursor-pointer ${isOpen ? "" : "hidden!"}`}
                        ></button>
                    </div>
                </div>
            </div >
            <div className={`bg-black/50 absolute w-full h-full z-40 transition-all duration-500 md:opacity-0 md:pointer-events-none ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(false)}
            ></div>
        </>
    )
}

export default Sidebar;
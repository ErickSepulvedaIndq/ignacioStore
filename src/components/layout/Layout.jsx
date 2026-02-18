// este layout es el que se encarga de mostrar el header y el sidenav en todas las paginas
// el Outlet es donde se renderizan las paginas segun la ruta
// asi que cada pagina se mostrara dentro de este layout

import { Outlet } from 'react-router-dom';
import Header from '../UI/header';
import SideNav from '../structure/sideNav';
export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <SideNav />
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}

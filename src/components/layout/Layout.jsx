// este layout es el que se encarga de mostrar el header y el sidenav en todas las paginas
// el Outlet es donde se renderizan las paginas segun la ruta
// asi que cada pagina se mostrara dentro de este layout

import { Outlet } from 'react-router-dom';
import Header from '../UI/header';
import SideNav from '../structure/sideNav';
import { useStockSync } from '../../api/hooks/useStockSync';
export default function Layout() {
    useStockSync();
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <SideNav />
            <main className="w-full pt-24 md:pt-28 px-1 md:p-4 lg:px-15 xl:px-35">
                <Outlet />
            </main>
        </div>
    );
}

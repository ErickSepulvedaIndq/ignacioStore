import { Outlet } from 'react-router-dom';
import Navbar from '../structure/Navbar';
import { useStockSync } from '../../api/hooks/stockSyncHook';
import Sidebar from '../structure/Sidebar';
export default function Layout() {
    useStockSync();
    return (
        <div className="min-h-screen bg-blue-900 flex flex-row flex-1">
            {/* <SideNav /> */}
            <Sidebar />
            <div className='flex flex-col flex-1'>
                <Navbar />

                <div className='bg-blue-900 flex flex-1 h-[calc(100vh-100px)] px-1 pb-1 md:px-4 md:pb-4 pt-0'>
                    <div className='bg-gray-50 flex flex-1 h-[calc(100vh-83px)] md:h-[calc(100vh-116px)] p-2 rounded-2xl overflow-auto'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Outlet } from 'react-router-dom';
import Navbar from '../structure/Navbar';
import { useStockSync } from '../../api/hooks/stockSyncHook';
import Sidebar from '../structure/Sidebar';
export default function Layout() {

    useStockSync();


    return (
        <div className="h-svh overflow-hidden bg-blue-900 flex flex-row flex-1">
            {/* <SideNav /> */}
            <Sidebar />
            <div className='flex flex-col flex-1'>
                <Navbar />

                <div className='bg-blue-900 flex flex-1 h-[calc(100svh-100px)] px-1 pb-1 md:px-4 md:pb-4 pt-0'>
                    <div className='bg-gray-50 flex flex-1 w-[calc(100svw-10px)] md:w-auto  h-[calc(100svh-83px)] md:h-[calc(100vh-116px)] p-2 rounded-2xl overflow-hidden'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

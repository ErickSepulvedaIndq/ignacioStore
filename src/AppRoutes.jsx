import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/guards/protectedRoutes';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/layout/Layout';
import ProductsPage from './pages/common/ProductsPage';
import MyPurchasesPage from './pages/common/MyPurchasesPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PurchaseHistoryPage from './pages/admin/PurchaseHistoryPage';
import ProductsManagementPage from './pages/admin/ProductsManagementPage';
import DebtorsPage from './pages/admin/DebtorsPage';
import GenerateReportPage from './pages/admin/GenerateReportPage';
import UserSettingsPage from './pages/common/UserSettingsPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    {/* con esto */}
                    <Route index element={<Navigate to="/products" replace />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="purchases" element={<MyPurchasesPage />} />
                    <Route path="settings" element={<UserSettingsPage />} />
                    <Route path="admin/users" element={<UserManagementPage />} />
                    <Route path="admin/purchaseHistory" element={<PurchaseHistoryPage />} />
                    <Route path="admin/products" element={<ProductsManagementPage />} />
                    <Route path="admin/debtors" element={<DebtorsPage />} />
                    <Route path="admin/reports" element={<GenerateReportPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AppRoutes;
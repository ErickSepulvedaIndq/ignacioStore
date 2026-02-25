import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProductManagement from './pages/productManagement.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import UserManagement from './pages/userManagement.jsx'
import Layout from './components/layout/Layout.jsx'
import { createRoot } from 'react-dom/client'
import Purchase from './pages/purchase.jsx'
import Product from './pages/product.jsx'
import Debtor from './pages/debtor.jsx'
import Report from './pages/report.jsx'
import Login from './pages/login.jsx'
import ChangePassword from './pages/changePassword.jsx'

import { StrictMode } from 'react'
import 'primeicons/primeicons.css'
import './index.css'
import ProtectedRoute from './components/guards/protectedRoutes.jsx'
import PurchaseHistory from './pages/purchaseHistory.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/products" replace />} />
                  <Route path="products" element={<Product />} />
                  <Route path="purchases" element={<Purchase />} />
                  <Route path="changePassword" element={<ChangePassword />} />
                  <Route path="admin/users" element={<UserManagement />} />
                  <Route path="admin/purchaseHistory" element={<PurchaseHistory />} />
                  <Route path="admin/products" element={<ProductManagement />} />
                  <Route path="admin/debtors" element={<Debtor />} />
                  <Route path="admin/reports" element={<Report />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

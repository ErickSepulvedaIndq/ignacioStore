import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'primeicons/primeicons.css'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/home.jsx'
import Product from './pages/product.jsx'
import Purchase from './pages/purchase.jsx'
import UserManagement from './pages/userManagement.jsx'
import ProductManagement from './pages/productManagement.jsx'
import Debtor from './pages/debtor.jsx'
import Login from './pages/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Product />} />
              <Route path="login" element={<Login />} />
              <Route path="products" element={<Product />} />
              <Route path="purchases" element={<Purchase />} />
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/products" element={<ProductManagement />} />
              <Route path="admin/debtors" element={<Debtor />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

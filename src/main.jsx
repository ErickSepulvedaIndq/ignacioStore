import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './context/SearchContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './AppRoutes.jsx'
import 'primeicons/primeicons.css'
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SearchProvider>
            <Toaster position="top-center" />

            <AppRoutes />

          </SearchProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);

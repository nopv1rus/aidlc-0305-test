import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Layout from '@/components/Layout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import TableManagementPage from '@/pages/TableManagementPage'
import MenuManagementPage from '@/pages/MenuManagementPage'
import OrderHistoryPage from '@/pages/OrderHistoryPage'
import SuperAdminPage from '@/pages/SuperAdminPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { admin } = useAuth()
  return admin?.role === 'super_admin' ? <>{children}</> : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
      <Route path="/tables" element={<PrivateRoute><Layout><TableManagementPage /></Layout></PrivateRoute>} />
      <Route path="/menus" element={<PrivateRoute><Layout><MenuManagementPage /></Layout></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><Layout><OrderHistoryPage /></Layout></PrivateRoute>} />
      <Route path="/super" element={<PrivateRoute><SuperAdminRoute><Layout><SuperAdminPage /></Layout></SuperAdminRoute></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

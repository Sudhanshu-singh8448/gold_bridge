import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import OAuthCallback from './pages/OAuthCallback'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import PricingPage from './pages/PricingPage'
import GoldRatesPage from './pages/GoldRatesPage'
import ReportsPage from './pages/ReportsPage'
import IndustriesPage from './pages/IndustriesPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import FAQPage from './pages/FAQPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardHome from './pages/DashboardHome'
import InventoryPage from './pages/dashboard/InventoryPage'
import SalesPage from './pages/dashboard/SalesPage'
import PurchasesPage from './pages/dashboard/PurchasesPage'
import CustomersPage from './pages/dashboard/CustomersPage'
import CustomerDetailsPage from './pages/dashboard/CustomerDetailsPage'
import ManufacturingPage from './pages/dashboard/ManufacturingPage'
import DashboardGoldRatesPage from './pages/dashboard/DashboardGoldRatesPage'
import DashboardReportsPage from './pages/dashboard/DashboardReportsPage'
import InvoicesPage from './pages/dashboard/InvoicesPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/gold-rates" element={<GoldRatesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Route>

          {/* Auth Pages (no layout wrapper) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Dashboard — Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/inventory" element={<InventoryPage />} />
              <Route path="/dashboard/sales" element={<SalesPage />} />
              <Route path="/dashboard/purchases" element={<PurchasesPage />} />
              <Route path="/dashboard/customers" element={<CustomersPage />} />
              <Route path="/dashboard/customers/:id" element={<CustomerDetailsPage />} />
              <Route path="/dashboard/manufacturing" element={<ManufacturingPage />} />
              <Route path="/dashboard/gold-rates" element={<DashboardGoldRatesPage />} />
              <Route path="/dashboard/reports" element={<DashboardReportsPage />} />
              <Route path="/dashboard/invoices" element={<InvoicesPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

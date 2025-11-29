import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// --- SAYFA IMPORTLARI (Görseldeki Yapıya Göre Düzeltildi) ---

// Public (Herkese Açık) Sayfalar
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OverviewPage from './pages/OverviewPage';
import MobileApp from './pages/MobileApp';
import Hardware from './pages/Hardware';
import HelpPage from './pages/HelpPage';
import OurPrice from './pages/OurPrice'; // Dosya ismin OurPrice.jsx (Tekil)


// Admin Dashboard Sayfaları
import Dashboard from './pages/Dashboard'; // Admin Layout (Sidebar + Header)
import GatewayManager from './pages/GatewayManager'; // Admin Gateway Listesi (CRUD)
import AddGateway from './pages/AddGateway'; // Admin Ekleme Formu

// Vatandaş Sayfaları
import CitizenDashboard from './pages/CitizenDashboard';
import CitizenOverview from './pages/CitizenOverview';
import CitizenDevices from './pages/CitizenDevices';
import CitizenEmergency from './pages/CitizenEmergency';
import CitizenMessages from './pages/CitizenMessages';
import CitizenSettings from './pages/CitizenSettings';

import { theme } from './theme';
import { ROUTES } from './constants/routes';
import { USER_ROLES } from './constants/userRoles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* --- PUBLIC ROUTES (Giriş Yapmadan Erişilenler) --- */}
            <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />

            {/* Tanıtım Sayfaları */}
            <Route path={ROUTES.OVERVIEW_PAGE} element={<OverviewPage />} />
            <Route path={ROUTES.SOLUTIONS_MOBILE_APP} element={<MobileApp />} />
            <Route path={ROUTES.SOLUTIONS_HARDWARE} element={<Hardware />} />
            <Route path={ROUTES.SUPPORT} element={<HelpPage />} />
            <Route path={ROUTES.PRICE} element={<OurPrice />} />

            {/* --- VATANDAŞ PANELİ (İç İçe Rotalama) --- */}
            <Route
              path="/panel"
              element={
                <PrivateRoute>
                  <CitizenDashboard />
                </PrivateRoute>
              }
            >
              {/* 1. Varsayılan Açılış: Genel Bakış */}
              <Route index element={<CitizenOverview />} />

              {/* 2. Diğer Sayfalar */}
              <Route path="cihazlarim" element={<CitizenDevices />} />
              <Route path="acil-durum" element={<CitizenEmergency />} />
              <Route path="mesajlar" element={<CitizenMessages />} />
              <Route path="ayarlar" element={<CitizenSettings />} />
            </Route>


            {/* --- ADMIN DASHBOARD (İç İçe Rotalama) --- */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  {/* Dashboard.jsx senin Layout dosyan (Sidebar içeren) */}
                  <Dashboard />
                </PrivateRoute>
              }
            >
              {/* 1. Varsayılan Açılış: Gateway Yönetimi */}
              <Route index element={<GatewayManager />} />

              {/* 2. Gateway Listesi (/dashboard/gateways) */}
              <Route path="gateways" element={<GatewayManager />} />

              {/* 3. Yeni Ekleme (/dashboard/add-gateway) */}
              <Route path="add-gateway" element={<AddGateway />} />

              {/* Harita Sayfası (Dosyası yoksa geçici text) */}
              <Route path="harita" element={<div>Canlı Harita Yakında...</div>} />
            </Route>


            {/* --- 404 / YÖNLENDİRME --- */}
            {/* Bilinmeyen bir adrese gidilirse Dashboard'a at */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
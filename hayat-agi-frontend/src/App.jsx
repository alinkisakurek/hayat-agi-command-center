import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import OverviewPage from './pages/OverviewPage';
import MobileApp from './pages/MobileApp';
import Hardware from './pages/Hardware';

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
            {/* Public Route - Landing Page */}
            <Route path={ROUTES.LANDING_PAGE} element={<LandingPage />} />

            {/* Public Route - Login */}
            <Route path={ROUTES.LOGIN} element={<Login />} />

            {/* Public Route - Overview Page */}
            <Route path={ROUTES.OVERVIEW_PAGE} element={<OverviewPage />} />

            {/* Public Route - Mobile App Solution */}
            <Route path={ROUTES.SOLUTIONS_MOBILE_APP} element={<MobileApp />} />
            <Route path={ROUTES.SOLUTIONS_HARDWARE} element={<Hardware />} />

            {/* Protected Routes - Administrator ve Regular User için */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Admin-only routes - Sadece Administrator rolü için */}
            <Route
              path={ROUTES.ADMIN}
              element={
                <PrivateRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ADMINISTRATOR]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* 404 - Tüm eşleşmeyen route'lar için */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

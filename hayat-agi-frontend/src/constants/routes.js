/**
 * Route Constants
 * 
 * Uygulamadaki tüm route path'lerini merkezi bir yerden yönetmek için
 */

export const ROUTES = {
  // Public Routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  LANDING_PAGE: '/',

  // Protected Routes
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',

  // Gateway Routes (gelecekte eklenecek)
  GATEWAYS: '/gateways',
  GATEWAY_DETAIL: '/gateways/:id',

  // Settings Routes (gelecekte eklenecek)
  SETTINGS: '/settings',
};


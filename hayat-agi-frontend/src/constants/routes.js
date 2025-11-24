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
  OVERVIEW_PAGE: '/genel-bakis',
  SOLUTIONS_MOBILE_APP: '/cozumlerimiz/mobil-uygulamamiz',
  SOLUTIONS_HARDWARE: '/cozumlerimiz/donanimlar',

  // Protected Routes
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',

  // Gateway Routes (gelecekte eklenecek)
  GATEWAYS: '/gateways',
  GATEWAY_DETAIL: '/gateways/:id',

  // Settings Routes (gelecekte eklenecek)
  SETTINGS: '/settings',
};


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
  DESTEK: '/destek', // Destek sayfası route'u eklendi
  FIYATLANDIRMA: '/fiyatlandirma', // Fiyatlandırma sayfası route'u

  // Protected Routes
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',

  // Gateway Routes (gelecekte eklenecek)
  GATEWAYS: '/gateways',
  GATEWAY_DETAIL: '/gateways/:id',

  // Settings Routes (gelecekte eklenecek)
  SETTINGS: '/settings',
};

/**
 * User Role Constants
 * 
 * Kullanıcı rolleri için sabitler
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  ADMINISTRATOR: 'administrator',
  USER: 'user',
  REGULAR: 'regular',
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.ADMINISTRATOR]: 'Administrator',
  [USER_ROLES.USER]: 'Regular User',
  [USER_ROLES.REGULAR]: 'Regular User',
};


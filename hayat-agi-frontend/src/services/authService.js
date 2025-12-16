import api from './api';

/**
 * Authentication Service
 * JWT olmadan, session-based authentication için API çağrıları
 */

/**
 * Kullanıcı girişi yapar
 * @param {string} email - Kullanıcı email adresi
 * @param {string} password - Kullanıcı şifresi
 * @returns {Promise<Object>} Kullanıcı bilgileri ve rolü
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Giriş yapılırken bir hata oluştu' };
  }
};

/**
 * Kullanıcı kaydı yapar (isteğe bağlı - admin için)
 * @param {Object} userData - Kullanıcı bilgileri
 * @returns {Promise<Object>} Oluşturulan kullanıcı bilgileri
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Kayıt olurken bir hata oluştu' };
  }
};

/**
 * Mevcut kullanıcının session bilgisini kontrol eder
 * @returns {Promise<Object>} Kullanıcı bilgileri
 */
export const checkSession = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Session kontrol edilemedi' };
  }
};

/**
 * Kullanıcı çıkışı yapar
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Logout hatası olsa bile session'ı temizle
    console.error('Logout error:', error);
  }
};

/**
 * Kullanıcı profil bilgilerini günceller
 * @param {Object} profileData - Güncellenecek profil bilgileri
 * @returns {Promise<Object>} Güncellenmiş kullanıcı bilgileri
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Profil güncellenirken bir hata oluştu' };
  }
};

/**
 * Kullanıcı profil bilgilerini getirir
 * @returns {Promise<Object>} Kullanıcı bilgileri
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Profil bilgileri alınırken bir hata oluştu' };
  }
};


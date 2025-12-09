import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, checkSession } from '../services/authService';
import { USER_ROLES } from '../constants/userRoles';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Uygulama başladığında session kontrolü yap
  useEffect(() => {
    const initAuth = async () => {
      // Önce localStorage'dan kontrol et
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (token && userString) {
        try {
          const userData = JSON.parse(userString);
          setUser(userData.user || userData); // Backend response formatına göre
          setIsAuthenticated(true);
          setLoading(false);
          return;
        } catch (error) {
          console.error('User data parse error:', error);
        }
      }
      
      // Eğer localStorage'da yoksa API'den kontrol et
      try {
        const userData = await checkSession();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Session yok veya geçersiz
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Kullanıcı girişi yapar
   * @param {string} email - Kullanıcı email adresi
   * @param {string} password - Kullanıcı şifresi
   */
  const login = async (email, password) => {
    try {
      const response = await loginService(email, password);
      // Backend response formatına göre user bilgisini al
      const userData = response.user || response;
      setUser(userData);
      setIsAuthenticated(true);
      // localStorage'ı da güncelle
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Giriş yapılırken bir hata oluştu',
      };
    }
  };

  /**
   * Kullanıcı çıkışı yapar
   */
  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Hata olsa bile local state'i temizle
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
   * @param {string|string[]} roles - Kontrol edilecek rol(ler)
   * @returns {boolean}
   */
  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  /**
   * Kullanıcının admin olup olmadığını kontrol eder
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole(USER_ROLES.ADMIN) || hasRole(USER_ROLES.ADMINISTRATOR);
  };

  /**
   * Kullanıcının regular user olup olmadığını kontrol eder
   * @returns {boolean}
   */
  const isRegularUser = () => {
    return hasRole(USER_ROLES.USER) || hasRole(USER_ROLES.REGULAR);
  };

  /**
   * localStorage'dan user bilgisini yeniden yükler
   */
  const refreshUser = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('User data parse error:', error);
      }
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isRegularUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


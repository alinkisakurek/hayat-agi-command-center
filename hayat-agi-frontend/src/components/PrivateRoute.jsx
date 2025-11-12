import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

/**
 * PrivateRoute Component
 * 
 * Kullanıcının authenticated olmasını ve belirli rollere sahip olmasını kontrol eder.
 * Görev gereği: Administrator ve Regular User rolleri için permissions'a göre erişim sağlar.
 * 
 * @param {React.ReactNode} children - Render edilecek component
 * @param {string|string[]} allowedRoles - Bu route'a erişebilecek roller (opsiyonel)
 * @param {boolean} requireAuth - Authentication gerektirip gerektirmediği (default: true)
 */
const PrivateRoute = ({ 
  children, 
  allowedRoles = null, 
  requireAuth = true 
}) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();

  // Loading durumunda spinner göster (opsiyonel)
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Authentication gerekiyorsa ve kullanıcı giriş yapmamışsa login'e yönlendir
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Role kontrolü yapılıyorsa (Görev gereği: Administrator ve Regular User permissions)
  if (allowedRoles && user) {
    const hasAccess = hasRole(allowedRoles);
    if (!hasAccess) {
      // Yetkisiz erişim - Dashboard'a yönlendir
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  // Tüm kontroller geçildi, children'ı render et
  return children;
};

export default PrivateRoute;


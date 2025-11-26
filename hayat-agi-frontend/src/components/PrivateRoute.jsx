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
  allowedRoles = null
}) => {
  // 1. BİLET KONTROLÜ (Token var mı?)
  const token = localStorage.getItem('token');

  // 2. KİMLİK KONTROLÜ (User bilgisi ve Rolü)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // --- KURAL 1: Token yoksa (Giriş yapmamışsa) -> Login'e git ---
  if (!token) {
    // replace: Geri butonuna basınca tekrar buraya gelmesini engeller
    return <Navigate to="/auth/login" replace />;
  }

  // --- KURAL 2: Rol Kontrolü (Varsa) ---
  if (allowedRoles && user) {
    // allowedRoles tek bir string ('admin') veya dizi (['admin', 'editor']) olabilir.
    // Hepsini diziye çevirip kontrol edelim.
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!rolesArray.includes(user.role)) {
      // Kullanıcının rolü izin verilenler listesinde yoksa -> Dashboard'a at
      // (Veya "403 Unauthorized" sayfasına)
      return <Navigate to="/dashboard" replace />;
    }
  }

  // --- KURAL 3: Her şey yolundaysa -> Sayfayı (Çocuğu) göster ---
  return children;
};

export default PrivateRoute;


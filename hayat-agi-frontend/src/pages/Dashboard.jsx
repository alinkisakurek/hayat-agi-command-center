import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAdmin, isRegularUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Hayat Ağı Command Center</h1>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user?.name || user?.email}</span>
              <span className="user-role">
                {isAdmin() && '👑 Administrator'}
                {isRegularUser() && '👤 Regular User'}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Hoş Geldiniz, {user?.name || user?.email}!</h2>
          <p>Rolünüz: <strong>{user?.role}</strong></p>
        </div>

        <div className="dashboard-content">
          <div className="info-card">
            <h3>Kullanıcı Bilgileri</h3>
            <div className="info-item">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="info-item">
              <strong>Rol:</strong> {user?.role}
            </div>
            {user?.region && (
              <div className="info-item">
                <strong>Bölge:</strong> {user?.region}
              </div>
            )}
          </div>

          <div className="info-card">
            <h3>Yetkileriniz</h3>
            <ul>
              {isAdmin() && (
                <>
                  <li>✅ Tüm gateway'leri görüntüleme</li>
                  <li>✅ Ağ sağlığını izleme</li>
                  <li>✅ Cihaz yönetimi</li>
                  <li>✅ Sistem ayarları</li>
                </>
              )}
              {isRegularUser() && (
                <>
                  <li>✅ Bölgesel gateway'leri görüntüleme</li>
                  <li>✅ Sınırlı veri erişimi</li>
                </>
              )}
            </ul>
          </div>

          <div className="info-card">
            <h3>Sonraki Adımlar</h3>
            <p>Dashboard içeriği ve harita görselleştirmesi yakında eklenecek.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


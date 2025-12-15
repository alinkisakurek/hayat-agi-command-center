import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Paper,
  Badge,
  Chip,
  Divider,
  Button
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // Renk opaklığı için

// İkonlar
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import RouterIcon from '@mui/icons-material/Router';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const drawerWidth = 280;
const menuItems = [
  { text: 'Genel Bakış', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Canlı Harita', icon: <MapIcon />, path: '/dashboard/harita' },
  { text: 'Gateway Listesi', icon: <RouterIcon />, path: '/dashboard/gateways' },
  { text: 'Bildirilen Sorunlar', icon: <BugReportIcon />, path: '/dashboard/sorunlar' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Kullanıcı", "role": "Personel"}');

  // Örnek bildirimler (gerçek uygulamada API'den gelecek)
  const notifications = [
    { id: 1, title: 'Yeni Sorun Bildirimi', message: 'Kullanıcı yeni bir sorun bildirdi', time: '10 dakika önce', read: false, type: 'issue' },
    { id: 2, title: 'Gateway Durumu', message: 'Gateway cihazı düşük pil uyarısı verdi', time: '1 saat önce', read: false, type: 'device' },
    { id: 3, title: 'Sistem Güncellemesi', message: 'Sistem başarıyla güncellendi', time: '3 saat önce', read: true, type: 'system' },
    { id: 4, title: 'Yeni Kullanıcı', message: 'Yeni bir kullanıcı kayıt oldu', time: '5 saat önce', read: true, type: 'user' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleNotificationClick = (notification) => {
    handleCloseNotifications();
    if (notification.type === 'issue') {
      navigate('/dashboard/sorunlar');
    } else if (notification.type === 'device') {
      navigate('/dashboard/gateways');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };


  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>


      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,40,103,0.3)'
          }}
        >
          <SecurityIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>
            HAYAT AĞI
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
            KOMUTA MERKEZİ
          </Typography>
        </Box>
      </Box>


      <Box sx={{ px: 2, mb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'rgba(0, 40, 103, 0.05)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar
            sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: '1.1rem' }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {user.role || 'Personel'}
            </Typography>
          </Box>
        </Paper>
      </Box>


      <List sx={{ px: 2 }}>
        <Typography variant="caption" sx={{ ml: 2, mb: 1, display: 'block', fontWeight: 'bold', color: 'text.secondary' }}>
          MENÜ
        </Typography>
        {menuItems.map((item) => {

          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? alpha('#002867', 0.1) : 'transparent', // Modern aktif arka plan
                  '&.Mui-selected': {
                    bgcolor: alpha('#002867', 0.1),
                    '&:hover': { bgcolor: alpha('#002867', 0.15) },
                  },
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                }}
              >
                <ListItemIcon sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* 4. Alt Menü (Ayarlar) */}
      <Box sx={{ mt: 'auto', px: 2, pb: 3 }}>
        <Typography variant="caption" sx={{ ml: 2, mb: 1, display: 'block', fontWeight: 'bold', color: 'text.secondary' }}>
          DİĞER
        </Typography>
        <ListItemButton sx={{ borderRadius: 3, color: 'text.secondary' }}>
          <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Sistem Ayarları" primaryTypographyProps={{ fontWeight: '500', fontSize: '0.95rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>


      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Sayfa Başlığı */}
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'Panel'}
            </Typography>
          </Box>

          {/* Sağ İkonlar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Bildirimler">
              <IconButton 
                sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                onClick={handleOpenNotifications}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon color="action" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Bildirimler Menüsü */}
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElNotifications}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotifications}
              PaperProps={{
                sx: {
                  width: 380,
                  maxHeight: 500,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderRadius: 2,
                  mt: 1.5
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1.5, fontSize: '1rem' }}>
                  Bildirimler
                </Typography>
                {notifications.length === 0 ? (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Henüz bildirim bulunmuyor
                    </Typography>
                  </Box>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        py: 1.5,
                        px: 1.5,
                        mb: 0.5,
                        borderRadius: 2,
                        bgcolor: notification.read ? 'transparent' : alpha('#004CB4', 0.05),
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={notification.read ? 400 : 700}
                            sx={{ fontSize: '0.875rem' }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Chip 
                              label="Yeni" 
                              size="small" 
                              color="primary"
                              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                            />
                          )}
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: '0.8rem',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {notification.time}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Box>
              <Divider />
              <Box sx={{ p: 1.5, textAlign: 'center' }}>
                <Button
                  size="small"
                  onClick={() => {
                    handleCloseNotifications();
                    navigate('/dashboard/sorunlar');
                  }}
                  sx={{ fontSize: '0.8rem' }}
                >
                  Tümünü Gör
                </Button>
              </Box>
            </Menu>

            <Tooltip title="Profil">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0.5, border: '1px solid #eee', bgcolor: 'background.paper' }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                  {user.name ? user.name.charAt(0) : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>


            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  mt: 1.5
                }
              }}
            >
              <MenuItem onClick={handleCloseUserMenu} sx={{ minWidth: 150 }}>
                Profilim
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 'bold' }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Çıkış Yap
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>


      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #eee',
              boxShadow: '4px 0 20px rgba(0,0,0,0.02)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>


      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          mt: 8
        }}
      >

        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
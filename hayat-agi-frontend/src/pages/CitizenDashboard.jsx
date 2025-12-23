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
  CircularProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { reportIssue } from '../services/issueService';

// İkonlar
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShieldIcon from '@mui/icons-material/Shield';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const drawerWidth = 280;

const menuItems = [
  { text: 'Genel Bakış', icon: <HomeIcon />, path: '/panel' },
  { text: 'Cihazlarım', icon: <DevicesIcon />, path: '/panel/cihazlarim' },
  { text: 'Yerleşke Bilgileri', icon: <LocationCityIcon />, path: '/panel/yerleske-bilgileri' },
  { text: 'Acil Durum', icon: <ShieldIcon />, path: '/panel/acil-durum' },
  { text: 'Mesajlar', icon: <MessageIcon />, path: '/panel/mesajlar' },
  { text: 'Ayarlar', icon: <SettingsIcon />, path: '/panel/ayarlar' }
];

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({ title: '', description: '' });
  const [issueSubmitting, setIssueSubmitting] = useState(false);

  // Örnek bildirimler (gerçek uygulamada API'den gelecek)
  const notifications = [
    { id: 1, title: 'Yeni Mesaj', message: 'Size yeni bir mesaj geldi', time: '2 saat önce', read: false, type: 'message' },
    { id: 2, title: 'Sistem Güncellemesi', message: 'Sistem başarıyla güncellendi', time: '5 saat önce', read: false, type: 'system' },
    { id: 3, title: 'Cihaz Durumu', message: 'Gateway cihazınız aktif', time: '1 gün önce', read: true, type: 'device' }
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleNotificationClick = (notification) => {
    handleCloseNotifications();
    if (notification.type === 'message') {
      navigate('/panel/mesajlar');
    }
  };

  const handleOpenIssueDialog = () => {
    setIssueDialogOpen(true);
  };

  const handleCloseIssueDialog = () => {
    setIssueDialogOpen(false);
    setIssueForm({ title: '', description: '' });
  };

  const handleIssueSubmit = async () => {
    if (!issueForm.title.trim() || !issueForm.description.trim()) {
      alert('Lütfen başlık ve açıklama alanlarını doldurun.');
      return;
    }

    setIssueSubmitting(true);
    try {
      console.log('Sorun bildirme başlatılıyor:', { title: issueForm.title, description: issueForm.description });
      const response = await reportIssue(issueForm.title.trim(), issueForm.description.trim());
      console.log('Sorun bildirme başarılı:', response);
      handleCloseIssueDialog();
      alert('Sorununuz başarıyla bildirildi. Teşekkür ederiz!');
    } catch (error) {
      console.error('Sorun bildirme hatası (detaylı):', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      const errorMessage = error?.response?.data?.message || error?.message || 'Sorun bildirilirken bir hata oluştu. Lütfen tekrar deneyin.';
      alert('Hata: ' + errorMessage);
    } finally {
      setIssueSubmitting(false);
    }
  };

  // Kullanıcı adının baş harflerini al
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const drawer = (
    <Box sx={{
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      justifyContent: 'space-between'
    }}>
      {/* Kullanıcı Profili Kartı - Yatay Düzen */}
      <Box sx={{ px: 2, mb: 2, mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'rgba(0, 76, 180, 0.08)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: '1px solid rgba(0, 76, 180, 0.1)'
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            {getUserInitials()}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              noWrap
              sx={{
                color: 'text.primary',
                mb: 0.25
              }}
            >
              {user?.name || 'Kullanıcı'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block'
              }}
            >
              Aktif
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* MENÜ Başlığı */}
      <Box sx={{ px: 3, mb: 1.5, mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 'bold',
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: '0.7rem'
          }}
        >
          MENÜ
        </Typography>
      </Box>

      {/* Menü Öğeleri */}
      <List sx={{ px: 2, flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/panel' && location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: 2,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? alpha('#004CB4', 0.1) : 'transparent',
                  '&.Mui-selected': {
                    bgcolor: alpha('#004CB4', 0.1),
                    '&:hover': {
                      bgcolor: alpha('#004CB4', 0.15)
                    }
                  },
                  '&:hover': {
                    bgcolor: isActive ? alpha('#004CB4', 0.15) : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? '600' : '400',
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Sorun Bildir - Ayarlar'ın Altında */}
      <Box sx={{
        px: 2,
        pb: 2,
        pt: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
        bgcolor: 'background.paper'
      }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleOpenIssueDialog}
            sx={{
              borderRadius: 2,
              py: 1.25,
              px: 2,
              color: 'error.main',
              '&:hover': {
                bgcolor: alpha('#d32f2f', 0.1),
              },
            }}
          >
            <ListItemIcon sx={{
              color: 'error.main',
              minWidth: 40
            }}>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sorun Bildir"
              primaryTypographyProps={{
                fontWeight: '600',
                fontSize: '0.95rem',
                color: 'error.main'
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  // Loading durumunda spinner göster
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Üst Header - Mavi Bar (Tam Genişlik) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: '100%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3, pl: { sm: 4 } }}>
          {/* Sol Taraf: Kalkan Logosu + HAYAT AĞI ve VATANDAŞ HİZMETİ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            {/* Kalkan Logosu */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <SecurityIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                HAYAT AĞI
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, letterSpacing: 0.5 }}>
                VATANDAŞ HİZMETİ
              </Typography>
            </Box>
          </Box>

          {/* Sağ Taraf: Bildirim + Kullanıcı Avatarı */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Bildirimler">
              <IconButton
                sx={{ color: 'inherit' }}
                onClick={handleOpenNotifications}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
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
                <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1rem' }}>
                  Bildirimler
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Bildirim bulunmuyor
                    </Typography>
                  </Box>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
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
                    navigate('/panel/mesajlar');
                  }}
                  sx={{ fontSize: '0.8rem' }}
                >
                  Tümünü Gör
                </Button>
              </Box>
            </Menu>

            <Tooltip title="Profil">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {getUserInitials()}
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
                  mt: 1.5,
                  minWidth: 150
                }
              }}
            >

              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 'bold' }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Çıkış Yap
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sol Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobil Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
              height: '100%',
              overflowY: 'auto'
            }
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: '4px 0 20px rgba(0,0,0,0.02)',
              zIndex: (theme) => theme.zIndex.drawer,
              mt: 8, // AppBar yüksekliği kadar margin-top
              height: 'calc(100vh - 64px)', // AppBar yüksekliğini çıkar
              overflowY: 'auto'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Ana İçerik Alanı */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          mt: 8,
          bgcolor: 'background.default',
          position: 'relative'
        }}
      >
        <Outlet />
      </Box>

      {/* Sorun Bildirme Dialog'u */}
      <Dialog
        open={issueDialogOpen}
        onClose={handleCloseIssueDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.375rem', fontWeight: 700, pb: 1.5 }}>
          Sorun Bildir
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Sorun Başlığı"
              placeholder="Sorununuzu kısaca özetleyin"
              value={issueForm.title}
              onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <TextField
              fullWidth
              label="Sorun Açıklaması"
              placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
              value={issueForm.description}
              onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
              variant="outlined"
              required
              multiline
              rows={6}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleCloseIssueDialog}
            color="inherit"
            sx={{
              px: 2.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleIssueSubmit}
            variant="contained"
            disabled={!issueForm.title.trim() || !issueForm.description.trim() || issueSubmitting}
            sx={{
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 2
            }}
          >
            {issueSubmitting ? 'Gönderiliyor...' : 'Bildir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CitizenDashboard;

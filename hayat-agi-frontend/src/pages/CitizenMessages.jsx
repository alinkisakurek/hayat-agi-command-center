import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  Divider,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CitizenMessages = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const messages = [
    {
      id: 1,
      type: 'notification',
      title: 'Sistem Güncellemesi',
      content: 'Gateway cihazınız v2.4.1 sürümüne güncellendi. Yeni özellikler için ayarlar sayfasını kontrol edin.',
      time: '2 saat önce',
      read: false,
      icon: 'info'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Pil Uyarısı',
      content: 'İş Yeri (Ofis) cihazınızın pili %15 seviyesine düştü. Lütfen şarj edin.',
      time: '5 saat önce',
      read: false,
      icon: 'warning'
    },
    {
      id: 3,
      type: 'system',
      title: 'Bağlantı Testi Başarılı',
      content: 'Tüm bağlantı testleri başarıyla tamamlandı. Sistem sağlıklı çalışıyor.',
      time: '1 gün önce',
      read: true,
      icon: 'success'
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Acil Durum Tatbikatı',
      content: 'Yarın saat 14:00\'te acil durum tatbikatı yapılacaktır. Lütfen katılım sağlayın.',
      time: '2 gün önce',
      read: true,
      icon: 'info'
    }
  ];

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'warning':
        return <WarningIcon sx={{ fontSize: 28 }} />;
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 28 }} />;
      default:
        return <InfoIcon sx={{ fontSize: 28 }} />;
    }
  };

  const getColor = (iconType) => {
    switch (iconType) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Başlık Bölümü */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Mesajlar
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400, lineHeight: 1.6 }}>
          Mesajlarınız ve bildirimleriniz
        </Typography>
      </Box>

      {/* Arama ve Filtreleme */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <TextField
          fullWidth
          placeholder="Mesajlarda ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '1rem',
              borderRadius: 2
            }
          }}
        />
      </Paper>

      {/* Tab'lar */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 52
            }
          }}
        >
          <Tab 
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Tümü</span>
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size="small"
                    color="error"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                )}
              </Stack>
            }
          />
          <Tab label="Bildirimler" />
          <Tab label="Uyarılar" />
          <Tab label="Sistem" />
        </Tabs>
      </Box>

      {/* Mesaj Listesi */}
      <Stack spacing={2.5}>
        {filteredMessages.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 3,
              border: '1px dashed rgba(0,0,0,0.15)',
              textAlign: 'center'
            }}
          >
            <MessageIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1rem' }}>
              Mesaj bulunamadı
            </Typography>
          </Paper>
        ) : (
          filteredMessages.map((message) => (
            <Card
              key={message.id}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: message.read ? '1px solid rgba(0,0,0,0.08)' : '2px solid primary.main',
                boxShadow: message.read ? '0 2px 8px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,76,180,0.15)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2.5} alignItems="flex-start">
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: `${getColor(message.icon)}.light`
                    }}
                  >
                    {getIcon(message.icon)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
                      <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1rem' }}>
                        {message.title}
                      </Typography>
                      {!message.read && (
                        <Chip
                          label="Yeni"
                          size="small"
                          color="primary"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                        />
                      )}
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {message.content}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {message.time}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Boş Durum */}
      {filteredMessages.length === 0 && searchQuery && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            border: '1px dashed rgba(0,0,0,0.15)',
            textAlign: 'center',
            mt: 3
          }}
        >
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '1.125rem' }}>
            Arama sonucu bulunamadı
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
            "{searchQuery}" için sonuç bulunamadı
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CitizenMessages;

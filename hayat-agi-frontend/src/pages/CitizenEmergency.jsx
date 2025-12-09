import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Alert,
  Divider
} from '@mui/material';
import EmergencyIcon from '@mui/icons-material/Emergency';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const CitizenEmergency = () => {
  const [emergencyStatus, setEmergencyStatus] = useState('normal');

  const emergencyContacts = [
    { name: 'Acil Durum Hattı', number: '112', type: 'emergency' },
    { name: 'İtfaiye', number: '110', type: 'emergency' },
    { name: 'Polis', number: '155', type: 'emergency' },
    { name: 'Jandarma', number: '156', type: 'emergency' }
  ];

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Başlık Bölümü */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Acil Durum
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400, lineHeight: 1.6 }}>
          Acil durum yönetimi ve bildirimler
        </Typography>
      </Box>

      {/* Acil Durum Durumu */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          background: emergencyStatus === 'emergency' 
            ? 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)'
            : 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)',
          color: emergencyStatus === 'emergency' ? 'white' : 'inherit'
        }}
      >
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: emergencyStatus === 'emergency' ? 'rgba(255,255,255,0.2)' : 'primary.light',
              border: emergencyStatus === 'emergency' ? '2px solid rgba(255,255,255,0.3)' : 'none'
            }}
          >
            <EmergencyIcon sx={{ fontSize: 32, color: emergencyStatus === 'emergency' ? 'white' : 'primary.main' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="800" sx={{ mb: 0.75, fontSize: { xs: '1.375rem', md: '1.75rem' } }}>
              {emergencyStatus === 'emergency' ? 'Acil Durum Aktif' : 'Sistem Normal'}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 400, opacity: 0.9 }}>
              {emergencyStatus === 'emergency' 
                ? 'Acil durum modu aktif. Tüm hizmetler acil durum için optimize edildi.'
                : 'Sistem normal çalışıyor. Tüm hizmetler kullanılabilir durumda.'}
            </Typography>
          </Box>
          <Button
            variant={emergencyStatus === 'emergency' ? 'outlined' : 'contained'}
            color={emergencyStatus === 'emergency' ? 'inherit' : 'error'}
            size="large"
            onClick={() => setEmergencyStatus(emergencyStatus === 'emergency' ? 'normal' : 'emergency')}
            sx={{
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 3,
              borderWidth: emergencyStatus === 'emergency' ? 2 : 0,
              borderColor: 'white',
              color: emergencyStatus === 'emergency' ? 'white' : 'white',
              '&:hover': {
                borderWidth: emergencyStatus === 'emergency' ? 2 : 0,
                bgcolor: emergencyStatus === 'emergency' ? 'rgba(255,255,255,0.1)' : 'error.dark'
              }
            }}
          >
            {emergencyStatus === 'emergency' ? 'Normal Moda Dön' : 'Acil Durum Aktif Et'}
          </Button>
        </Stack>
      </Paper>

      {/* Acil Durum İletişim Numaraları */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="700" sx={{ mb: 3, fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
          Acil Durum İletişim Numaraları
        </Typography>
        <Grid container spacing={2.5}>
          {emergencyContacts.map((contact, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  },
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'error.light',
                      mx: 'auto',
                      mb: 1.5
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 28, color: 'error.main' }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
                    {contact.name}
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="error.main" sx={{ fontSize: '1.75rem', mb: 1.5 }}>
                    {contact.number}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ mt: 1.5, py: 1.25, fontSize: '0.9rem', fontWeight: 700, borderRadius: 2 }}
                    href={`tel:${contact.number}`}
                  >
                    Ara
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Acil Durum Bilgilendirmeleri */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="700" sx={{ mb: 3, fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
          Acil Durum Bilgilendirmeleri
        </Typography>
        <Stack spacing={2.5}>
          <Alert 
            severity="warning" 
            icon={<WarningIcon sx={{ fontSize: 24 }} />}
            sx={{
              p: 2.5,
              borderRadius: 3,
              fontSize: '0.95rem',
              '& .MuiAlert-message': {
                fontSize: '0.95rem'
              }
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
              Deprem Öncesi Hazırlık
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
              Deprem öncesi hazırlık yapmanız önemlidir. Acil durum çantanızı hazır tutun ve aile üyelerinizle buluşma noktalarını belirleyin.
            </Typography>
          </Alert>

          <Alert 
            severity="info" 
            icon={<InfoIcon sx={{ fontSize: 24 }} />}
            sx={{
              p: 2.5,
              borderRadius: 3,
              fontSize: '0.95rem',
              '& .MuiAlert-message': {
                fontSize: '0.95rem'
              }
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
              Hayat Ağı Kullanımı
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
              Acil durumlarda Hayat Ağı otomatik olarak aktif hale gelir ve tüm cihazlarınız birbirine bağlanır. 
              İnternet bağlantısı olmasa bile mesh ağı üzerinden iletişim kurabilirsiniz.
            </Typography>
          </Alert>

          <Alert 
            severity="success" 
            icon={<CheckCircleIcon sx={{ fontSize: 24 }} />}
            sx={{
              p: 2.5,
              borderRadius: 3,
              fontSize: '0.95rem',
              '& .MuiAlert-message': {
                fontSize: '0.95rem'
              }
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
              Sistem Durumu
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
              Tüm gateway cihazlarınız aktif ve çalışır durumda. Acil durumlarda otomatik olarak devreye girecektir.
            </Typography>
          </Alert>
        </Stack>
      </Box>

      {/* Konum Bilgisi */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.light'
              }}
            >
              <LocationOnIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
                Kayıtlı Konumunuz
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Acil durumlarda konumunuz otomatik olarak paylaşılacaktır. Konum bilginizi güncel tutmanız önemlidir.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="large"
              startIcon={<LocationOnIcon />}
              sx={{
                px: 3.5,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 3
              }}
            >
              Konumu Güncelle
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CitizenEmergency;

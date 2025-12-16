import React, { useEffect, useState } from 'react';
import { getUserGateways } from '../api/gatewayService'; // Servis isminin doğru olduğundan emin ol
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Chip,
  Button,
  Divider,
  Avatar,
  Paper,
  CircularProgress // Yükleme ikonu eklendi
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';

const CitizenDevices = () => {
  const navigate = useNavigate();


  const [gateways, setGateways] = useState([]); // Verileri tutacak dizi
  const [loading, setLoading] = useState(true); // Yükleme durumu

  const getBatteryColor = (level) => {
    if (level > 50) return "success";
    if (level > 20) return "warning";
    return "error";
  };

  // Tarih formatlama yardımcısı
  const formatLastSeen = (dateString) => {
    if (!dateString) return 'Bilinmiyor';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        // Backend'den veriyi çek (Sadece senin cihazların gelir)
        const data = await getUserGateways();
        setGateways(data);
      } catch (err) {
        console.error("Cihazlar yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGateways();
  }, []);

  // Yükleniyor ekranı
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Başlık Bölümü */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Cihazlarım
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400, lineHeight: 1.6 }}>
            Afet durumuna hazırlık için cihazlarınızın durumunu buradan takip edebilirsiniz.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/panel/cihazlarim/ekle')}
          sx={{
            px: 3.5,
            py: 1.25,
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: 3,
            minWidth: { xs: '100%', sm: 170 }
          }}
        >
          Cihaz Ekle
        </Button>
      </Box>

      {/* Grid Bölümü */}
      <Grid container spacing={4}>
        {/* 2. STATE İSMİ DÜZELTİLDİ: myGateways -> gateways */}
        {gateways.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
              <Typography color="text.secondary">Henüz kayıtlı bir cihazınız yok.</Typography>
            </Paper>
          </Grid>
        ) : (
          gateways.map((device) => (
            <Grid item xs={12} md={6} key={device._id || device.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: device.status === 'low_battery' ? '2px solid #d32f2f' : '1px solid rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Chip
                  label={device.status === 'active' ? 'Aktif & Hazır' : 'Pil Düşük / Pasif'}
                  color={device.status === 'active' ? 'success' : 'error'}
                  icon={device.status === 'active' ? <CheckCircleIcon /> : <WarningIcon />}
                  sx={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    height: 36,
                    px: 1.5,
                    zIndex: 1
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.light',
                        color: 'primary.main'
                      }}
                    >
                      <RouterIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" fontWeight="800" sx={{ mb: 0.75, fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
                        {device.name}
                      </Typography>
                      {/* 3. VERİ ALANLARI DÜZELTİLDİ (Backend Schema'ya göre) */}
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        Son görülme: {formatLastSeen(device.last_seen)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                        {/* Address obje veya string gelebilir, kontrol edelim */}
                        {typeof device.address === 'object' ? device.address.full || 'Adres yok' : device.address}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 3, borderWidth: 1 }} />

                  <Grid container spacing={2.5}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          bgcolor: 'background.default',
                          borderRadius: 3,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
                          <BatteryStdIcon color={getBatteryColor(device.battery)} sx={{ fontSize: 24 }} />
                          <Typography variant="subtitle1" fontWeight="700" sx={{ fontSize: '0.9rem' }}>
                            Batarya
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={device.battery || 0}
                          color={getBatteryColor(device.battery)}
                          sx={{ height: 10, borderRadius: 5, mb: 1.5 }}
                        />
                        <Typography variant="h5" sx={{ textAlign: 'right', fontWeight: '800', fontSize: '1.375rem' }}>
                          %{device.battery || 0}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          bgcolor: 'background.default',
                          borderRadius: 3,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
                          <SmartphoneIcon color="primary" sx={{ fontSize: 24 }} />
                          <Typography variant="subtitle1" fontWeight="700" sx={{ fontSize: '0.9rem' }}>
                            Bağlı Cihaz
                          </Typography>
                        </Stack>
                        {/* Backend alan adı: connected_devices */}
                        <Typography variant="h3" fontWeight="800" color="primary.main" sx={{ mb: 0.75, fontSize: '2.25rem' }}>
                          {device.connected_devices || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          Telefon mesh ağına bağlı
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {/* Backend alan adı: signal_quality */}
                          <SignalCellularAltIcon
                            color={device.signal_quality === 'strong' ? 'success' : 'warning'}
                            sx={{ fontSize: 28 }}
                          />
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                              Mesh Bağlantı Kalitesi
                            </Typography>
                            <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.125rem' }}>
                              {device.signal_quality === 'strong' ? 'Mükemmel' : device.signal_quality === 'medium' ? 'Orta' : 'Zayıf'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditLocationIcon />}
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.25,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        borderRadius: 3
                      }}
                    >
                      Konumu Güncelle
                    </Button>
                    <Button
                      variant="contained"
                      color={device.status === 'active' ? 'primary' : 'error'}
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.25,
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        borderRadius: 3
                      }}
                    >
                      {device.status === 'active' ? 'Bağlantı Testi Yap' : 'Sorunu Gider'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default CitizenDevices;
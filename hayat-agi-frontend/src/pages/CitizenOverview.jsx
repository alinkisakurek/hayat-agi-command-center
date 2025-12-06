import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Chip,
  Divider,
  Link
} from '@mui/material';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RouterIcon from '@mui/icons-material/Router';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

// Cihaz verileri (CitizenDevices.jsx ile aynı)
const myGateways = [
  {
    id: 1,
    name: "Ev (Salon)",
    status: "active",
    battery: 92,
    signal: "strong",
    connectedPhones: 4,
    lastSeen: "Az önce",
    address: "Çankaya Mah. 102. Sokak No:5"
  },
  {
    id: 2,
    name: "İş Yeri (Ofis)",
    status: "low_battery",
    battery: 15,
    signal: "medium",
    connectedPhones: 12,
    lastSeen: "10 dakika önce",
    address: "Teknokent B Blok Kat:2"
  }
];

const CitizenOverview = () => {
  // Tüm cihazların durumunu kontrol et
  const allDevicesActive = useMemo(() => {
    return myGateways.every(device => device.status === 'active');
  }, []);

  // Ortalama pil durumu
  const averageBattery = useMemo(() => {
    const total = myGateways.reduce((sum, device) => sum + device.battery, 0);
    return Math.round(total / myGateways.length);
  }, []);

  // Son bağlantı zamanı (en yakın)
  const lastConnectionTime = useMemo(() => {
    // En yakın bağlantıyı bul (basit mantık)
    return "1 dakika önce";
  }, []);

  // Pil rengi belirleme fonksiyonu
  const getBatteryColor = (level) => {
    if (level > 50) return "success";
    if (level > 20) return "warning";
    return "error";
  };

  return (
    <Box>
      {/* Başlık ve Alt Başlık */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Genel Bakış
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gateway cihazınızın durumu ve sistem bilgileri
        </Typography>
      </Box>

      {/* Bağlantı Durumu Banner'ı - Dinamik (Yeşil/Kırmızı) - Dar ve Uzun */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: allDevicesActive ? 'success.main' : 'error.main',
          color: 'white',
          p: 2,
          py: 2.5,
          mb: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1 }}>
          {allDevicesActive ? (
            <SecurityIcon sx={{ fontSize: 40, opacity: 0.9 }} />
          ) : (
            <ErrorOutlineIcon sx={{ fontSize: 40, opacity: 0.9 }} />
          )}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5, lineHeight: 1.3 }}>
              {allDevicesActive ? 'Ağa Bağlısınız' : 'Güvenli Değil'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
              {allDevicesActive
                ? 'Hayat Ağı Aktif - Tüm hizmetler kullanılabilir'
                : 'Bazı cihazlarınızda sorun tespit edildi. Lütfen kontrol edin.'}
            </Typography>
            {allDevicesActive && (
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, lineHeight: 1.4 }}>
                Ev ve İş yeri cihazlarınız aktif. Ağ bağlantısı sağlıklı.
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 'bold',
            px: 2.5,
            py: 1,
            minWidth: 120,
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          {allDevicesActive ? 'Çevrimiçi' : 'Sorun Var'}
        </Button>
      </Paper>

      {/* Cihazlar Önizleme - Kompakt ve Tıklanabilir */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Cihazlarım
        </Typography>
        <Grid container spacing={2}>
          {myGateways.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <Card
                onClick={() => {
                  // TODO: Yönlendirme eklenecek
                  console.log('Cihaz tıklandı:', device.id);
                }}
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  border: device.status === 'low_battery' ? '1px solid #d32f2f' : 'none',
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Chip
                  label={device.status === 'active' ? 'Aktif & Hazır' : 'Pil Düşük!'}
                  color={device.status === 'active' ? 'success' : 'error'}
                  icon={device.status === 'active' ? <CheckCircleIcon /> : null}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    height: 24
                  }}
                />

                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        borderRadius: 2
                      }}
                    >
                      <RouterIcon fontSize="medium" />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" fontWeight="700" noWrap>
                        {device.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Son görülme: {device.lastSeen}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                          <BatteryStdIcon
                            color={getBatteryColor(device.battery)}
                            sx={{ fontSize: 18 }}
                          />
                          <Typography variant="caption" fontWeight="bold" fontSize="0.7rem">
                            Batarya
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={device.battery}
                          color={getBatteryColor(device.battery)}
                          sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                        />
                        <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.85rem' }}>
                          %{device.battery}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                          <SmartphoneIcon color="primary" sx={{ fontSize: 18 }} />
                          <Typography variant="caption" fontWeight="bold" fontSize="0.7rem">
                            Bağlı
                          </Typography>
                        </Stack>
                        <Typography variant="h5" fontWeight="800" color="primary.main" sx={{ fontSize: '1.5rem' }}>
                          {device.connectedPhones}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                          Cihaz
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <SignalCellularAltIcon
                          color={device.signal === 'strong' ? 'success' : 'warning'}
                          sx={{ fontSize: 16 }}
                        />
                        <Typography variant="caption" fontSize="0.75rem">
                          Mesh:
                          <Box component="span" fontWeight="bold" sx={{ ml: 0.5 }}>
                            {device.signal === 'strong' ? 'Mükemmel' : 'Orta'}
                          </Box>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Son Aktiviteler Kartı */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Son Aktiviteler
          </Typography>
          <Stack spacing={2}>
            {/* Aktivite 1 */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    p: 1,
                    bgcolor: 'warning.light',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <WarningIcon sx={{ color: 'warning.main', fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Acil Durum Tatbikatı
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Yarın saat 14:00'te acil durum tatbikatı yapılacaktır.
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      2 saat önce
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Aktivite 2 */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    p: 1,
                    bgcolor: 'success.light',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Sistem Güncellemesi
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Gateway cihazınız v2.4.1 sürümüne güncellendi.
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      5 saat önce
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Aktivite 3 */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    p: 1,
                    bgcolor: 'primary.light',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SignalCellularAltIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Bağlantı Testi Başarılı
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tüm bağlantı testleri başarıyla tamamlandı.
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      1 gün önce
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CitizenOverview;

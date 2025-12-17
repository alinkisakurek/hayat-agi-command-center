import React, { useMemo, useEffect, useState } from 'react';
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
  Avatar
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { getUserGateways } from '../api/gatewayService';

// Fetch real gateway data for the current user
const useGateways = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getUserGateways();
        if (mounted) setGateways(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gateways fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return { gateways, loading };
};

const CitizenOverview = () => {
  // Use real gateways
  const { gateways, loading } = useGateways();

  const allDevicesActive = useMemo(() => {
    if (!gateways || gateways.length === 0) return false;
    return gateways.every(device => device.status === 'active');
  }, [gateways]);

  const averageBattery = useMemo(() => {
    if (!gateways || gateways.length === 0) return 0;
    const total = gateways.reduce((sum, device) => sum + (device.battery || 0), 0);
    return Math.round(total / gateways.length);
  }, [gateways]);

  const getBatteryColor = (level) => {
    if (level > 50) return "success";
    if (level > 20) return "warning";
    return "error";
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Bilinmiyor';
    const date = new Date(lastSeen);
    if (isNaN(date.getTime())) return String(lastSeen);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Başlık Bölümü */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Genel Bakış
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400 }}>
          Gateway cihazlarınızın durumu ve sistem bilgileri
        </Typography>
      </Box>

      {/* Durum Banner'ı */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: allDevicesActive ? 'success.main' : 'error.main',
          color: 'white',
          p: { xs: 2.5, md: 3.5 },
          mb: 4,
          borderRadius: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2.5,
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1 }}>
          <Avatar
            sx={{
              width: { xs: 52, md: 64 },
              height: { xs: 52, md: 64 },
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {allDevicesActive ? (
              <SecurityIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
            )}
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                mb: 0.75,
                lineHeight: 1.2,
                fontSize: { xs: '1.375rem', md: '1.75rem' }
              }}
            >
              {allDevicesActive ? 'Ağa Bağlısınız' : 'Bağlantı Sorunu Tespit Edildi'}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.95,
                lineHeight: 1.5,
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 400
              }}
            >
              {allDevicesActive
                ? 'Hayat Ağı Aktif - Tüm hizmetler kullanılabilir'
                : 'Bazı cihazlarınızda sorun tespit edildi. Lütfen kontrol edin.'}
            </Typography>
            {allDevicesActive && (
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  mt: 0.75,
                  lineHeight: 1.5,
                  fontSize: { xs: '0.85rem', md: '0.95rem' }
                }}
              >
                Ev ve İş yeri cihazlarınız aktif. Ağ bağlantısı sağlıklı.
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* İstatistik Kartları */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', p: 2.5, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                <RouterIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Toplam Cihaz
                </Typography>
                <Typography variant="h4" fontWeight="800" color="primary.main" sx={{ fontSize: '1.75rem' }}>
                  {loading ? '—' : gateways.length}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', p: 2.5, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                <BatteryStdIcon sx={{ fontSize: 24, color: 'success.main' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Ortalama Batarya
                </Typography>
                <Typography variant="h4" fontWeight="800" color="success.main" sx={{ fontSize: '1.75rem' }}>
                  %{averageBattery}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', p: 2.5, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
              <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                <SmartphoneIcon sx={{ fontSize: 24, color: 'info.main' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                  Bağlı Cihazlar
                </Typography>
                <Typography variant="h4" fontWeight="800" color="info.main" sx={{ fontSize: '1.75rem' }}>
                  {gateways.reduce((sum, d) => sum + (d.connected_devices || 0), 0)}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Cihazlar Bölümü */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="700" sx={{ mb: 3, fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
          Cihazlarım
        </Typography>
        <Grid container spacing={2.5}>
          {(loading ? [] : gateways).map((device) => (
            <Grid item xs={12} md={6} key={device._id || device.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: device.status === 'low_battery' ? '2px solid #d32f2f' : '1px solid rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Chip
                  label={device.status === 'active' ? 'Aktif & Hazır' : 'Aktif Değil'}
                  color={device.status === 'active' ? 'success' : 'error'}
                  icon={device.status === 'active' ? <CheckCircleIcon /> : <WarningIcon />}
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    height: 32,
                    px: 1
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 2.5 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.light',
                        color: 'primary.main'
                      }}
                    >
                      <RouterIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h5" fontWeight="800" sx={{ mb: 0.5, fontSize: { xs: '1.125rem', md: '1.375rem' } }}>
                        {device.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        Son görülme: {formatLastSeen(device.last_seen || device.lastSeen)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2.5, borderWidth: 1 }} />

                  <Grid container spacing={2.5}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.25 }}>
                          <BatteryStdIcon
                            color={getBatteryColor(device.battery)}
                            sx={{ fontSize: 20 }}
                          />
                          <Typography variant="subtitle1" fontWeight="700" sx={{ fontSize: '0.875rem' }}>
                            Batarya
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={device.battery}
                          color={getBatteryColor(device.battery)}
                          sx={{ height: 8, borderRadius: 4, mb: 1.25 }}
                        />
                        <Typography variant="h6" sx={{ textAlign: 'right', fontWeight: '800', fontSize: '1.125rem' }}>
                          %{device.battery}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.25 }}>
                          <SmartphoneIcon color="primary" sx={{ fontSize: 20 }} />
                          <Typography variant="subtitle1" fontWeight="700" sx={{ fontSize: '0.875rem' }}>
                            Bağlı
                          </Typography>
                        </Stack>
                        <Typography variant="h4" fontWeight="800" color="primary.main" sx={{ mb: 0.5, fontSize: '1.75rem' }}>
                          {device.connectedPhones}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Cihaz
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2
                      }}>
                        <SignalCellularAltIcon
                          color={device.signal === 'strong' ? 'success' : 'warning'}
                          sx={{ fontSize: 24 }}
                        />
                        <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
                          Mesh Bağlantı:
                          <Box component="span" fontWeight="700" sx={{ ml: 1 }}>
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

      {/* Son Aktiviteler */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3, fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
            Son Aktiviteler
          </Typography>
          <Stack spacing={2.5}>
            <Box>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'warning.light', width: 44, height: 44 }}>
                  <WarningIcon sx={{ color: 'warning.main', fontSize: 24 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
                    Acil Durum Tatbikatı
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1.25, fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Yarın saat 14:00'te acil durum tatbikatı yapılacaktır.
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      2 saat önce
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ borderWidth: 1 }} />

            <Box>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'success.light', width: 44, height: 44 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
                    Sistem Güncellemesi
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1.25, fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Gateway cihazınız v2.4.1 sürümüne güncellendi.
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      5 saat önce
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ borderWidth: 1 }} />

            <Box>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'primary.light', width: 44, height: 44 }}>
                  <SignalCellularAltIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.75, fontSize: '1rem' }}>
                    Bağlantı Testi Başarılı
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1.25, fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Tüm bağlantı testleri başarıyla tamamlandı.
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
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

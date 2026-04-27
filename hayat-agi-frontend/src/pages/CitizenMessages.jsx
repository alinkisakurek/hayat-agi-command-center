import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Alert as MuiAlert
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouterIcon from '@mui/icons-material/Router';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import SosIcon from '@mui/icons-material/Sos';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { getUserGateways, getGatewayAlerts } from '../api/gatewayService';

dayjs.locale('tr');

// Backend Alert.type → görünür etiket, ikon, MUI severity rengi, kategori (sekme filtresi)
const ALERT_PRESET = {
  sos: { label: 'Acil Durum Çağrısı (SOS)', icon: SosIcon, color: 'error', category: 'urgent' },
  manual_message: { label: 'Acil Durum Mesajı', icon: MessageIcon, color: 'error', category: 'urgent' },
  crash_detection: { label: 'Çarpma Algılandı', icon: WarningIcon, color: 'error', category: 'urgent' },
  low_battery: { label: 'Pil Uyarısı', icon: BatteryAlertIcon, color: 'warning', category: 'system' },
  other: { label: 'Bilgi', icon: InfoIcon, color: 'info', category: 'system' },
};

const presetFor = (type) => ALERT_PRESET[type] || ALERT_PRESET.other;

const CitizenMessages = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const gateways = await getUserGateways();
        const perGatewayAlerts = await Promise.all(
          gateways.map(async (gw) => {
            try {
              const alerts = await getGatewayAlerts(gw._id, { limit: 100 });
              return alerts.map((a) => ({ ...a, gatewayName: gw.name }));
            } catch (err) {
              console.error(`Alerts fetch failed for gateway ${gw._id}:`, err);
              return [];
            }
          })
        );
        const merged = perGatewayAlerts
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (!cancelled) setItems(merged);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Mesajlar yüklenemedi.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const tabFilter = ['all', 'urgent', 'system'][tabValue];

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const preset = presetFor(it.type);
      if (tabFilter !== 'all' && preset.category !== tabFilter) return false;
      if (!q) return true;
      const message = it.payload?.message || '';
      return (
        preset.label.toLowerCase().includes(q) ||
        message.toLowerCase().includes(q) ||
        (it.gatewayName || '').toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery, tabFilter]);

  const unreadCount = useMemo(
    () => items.filter((it) => it.status === 'open').length,
    [items]
  );

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="800"
          sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
        >
          Mesajlar
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400, lineHeight: 1.6 }}
        >
          Hayat Ağı Cihazlarınızdan gelen acil durum kayıtları ve sistem uyarıları
        </Typography>
      </Box>

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

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
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
          <Tab label="Acil Durum" />
          <Tab label="Sistem" />
        </Tabs>
      </Box>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </MuiAlert>
      )}

      {loading ? (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          {filteredItems.length === 0 ? (
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
                {searchQuery ? `"${searchQuery}" için sonuç bulunamadı` : 'Henüz mesaj yok'}
              </Typography>
            </Paper>
          ) : (
            filteredItems.map((item) => {
              const preset = presetFor(item.type);
              const Icon = preset.icon;
              const isOpen = item.status === 'open';
              const message = item.payload?.message || '';
              return (
                <Card
                  key={item._id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: isOpen ? '2px solid' : '1px solid rgba(0,0,0,0.08)',
                    borderColor: isOpen ? `${preset.color}.main` : undefined,
                    boxShadow: isOpen
                      ? `0 4px 20px rgba(0,76,180,0.12)`
                      : '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
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
                          bgcolor: `${preset.color}.light`,
                          color: `${preset.color}.dark`
                        }}
                      >
                        <Icon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25, flexWrap: 'wrap' }}>
                          <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1rem' }}>
                            {preset.label}
                          </Typography>
                          {isOpen && (
                            <Chip
                              label="Yeni"
                              size="small"
                              color={preset.color}
                              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                            />
                          )}
                          {item.status === 'resolved' && (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                              label="Çözüldü"
                              size="small"
                              variant="outlined"
                              color="success"
                              sx={{ height: 22, fontSize: '0.7rem' }}
                            />
                          )}
                        </Stack>
                        {message && (
                          <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ mb: 1.5, fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
                          >
                            {message}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                          {item.gatewayName && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <RouterIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                {item.gatewayName}
                              </Typography>
                            </Stack>
                          )}
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                              {dayjs(item.createdAt).format('D MMM YYYY HH:mm')}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>
      )}
    </Box>
  );
};

export default CitizenMessages;

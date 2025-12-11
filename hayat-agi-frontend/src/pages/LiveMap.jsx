import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Stack, 
    Card, 
    CardContent,
    Chip,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Divider,
    alpha,
    Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import MapIcon from '@mui/icons-material/Map';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MapComponent from '../components/MapComponent';
import GatewayList from '../components/GatewayList';
import GatewayDetailCard from '../components/GatewayDetailCard';
import { getGateways } from '../api/gatewayService';
import dayjs from 'dayjs';

const LiveMap = () => {
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [batteryFilter, setBatteryFilter] = useState('all');

    // Gateway verilerini yükle
    const loadGateways = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setIsRefreshing(true);
            }
            setError(null);
            const data = await getGateways();

            // Verileri düzgün formatta işle
            const formattedData = data.map(gw => ({
                ...gw,
                status: gw.status || 'inactive',
                battery: gw.battery || 0,
                signal_quality: gw.signal_quality || 'none',
                connected_devices: gw.connected_devices || 0,
                uptime: gw.uptime || 0,
                last_seen: gw.last_seen || new Date(),
                location: gw.location || null
            }));

            setGateways(formattedData);
            setLastUpdate(new Date());

            // Eğer seçili gateway varsa, güncellenmiş veriyi bul ve güncelle
            setSelectedGateway(prev => {
                if (prev) {
                    const updated = formattedData.find(gw => gw._id === prev._id);
                    return updated || prev;
                }
                return prev;
            });
        } catch (err) {
            console.error('Gateway verileri yüklenirken hata:', err);
            setError('Veriler yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    // İlk yükleme
    useEffect(() => {
        loadGateways(true);
    }, [loadGateways]);

    // Periyodik güncelleme (5 saniyede bir)
    useEffect(() => {
        const interval = setInterval(() => {
            loadGateways(false);
        }, 5000);

        return () => clearInterval(interval);
    }, [loadGateways]);

    // Gateway seçme handler'ı
    const handleGatewaySelect = (gateway) => {
        setSelectedGateway(gateway);
    };

    // Marker tıklama handler'ı
    const handleMarkerClick = (gateway) => {
        setSelectedGateway(gateway);
    };

    // İstatistikleri hesapla
    const stats = {
        total: gateways.length,
        active: gateways.filter(gw => gw.status === 'active').length,
        inactive: gateways.filter(gw => gw.status === 'inactive').length,
        lowBattery: gateways.filter(gw => gw.status === 'low_battery' || (gw.battery || 0) < 20).length,
        avgBattery: gateways.length > 0 
            ? Math.round(gateways.reduce((sum, gw) => sum + (gw.battery || 0), 0) / gateways.length)
            : 0,
        totalDevices: gateways.reduce((sum, gw) => sum + (gw.connected_devices || 0), 0)
    };

    // Filtrelenmiş gateway'ler
    const filteredGateways = gateways.filter(gw => {
        if (statusFilter !== 'all' && gw.status !== statusFilter) return false;
        if (searchTerm && !gw.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (batteryFilter === 'low' && (gw.battery || 0) >= 20) return false;
        if (batteryFilter === 'medium' && ((gw.battery || 0) < 20 || (gw.battery || 0) >= 50)) return false;
        if (batteryFilter === 'high' && (gw.battery || 0) < 50) return false;
        return true;
    });

    // Hata durumunda göster
    if (error && !loading) {
        return (
            <Box sx={{ p: 3, height: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 500, textAlign: 'center' }}>
                    <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                    <Typography variant="h5" fontWeight="700" gutterBottom>
                        Harita Yüklenemedi
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                    <Button 
                        onClick={() => loadGateways(true)}
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        sx={{ mt: 2 }}
                    >
                        Tekrar Dene
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', width: '100%', minHeight: '600px', p: 2 }}>
            <Box sx={{ maxWidth: '98%', mx: 'auto' }}>
            {/* İstatistikler Dashboard */}
            <Paper 
                elevation={6}
                sx={{ 
                    mb: 3, 
                    p: 3, 
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #004CB4 0%, #0063E5 100%)',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(0, 76, 180, 0.4)',
                    border: '1px solid',
                    borderColor: alpha('#fff', 0.1),
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        pointerEvents: 'none'
                    }
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    bgcolor: alpha('#fff', 0.2),
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <MapIcon sx={{ fontSize: '2rem' }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 0.5 }}>
                                    Canlı Harita Yönetimi
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                    Gerçek zamanlı gateway izleme ve yönetim sistemi
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            {lastUpdate && (
                                <Chip
                                    icon={<AccessTimeIcon sx={{ color: 'white !important', fontSize: '1rem !important' }} />}
                                    label={`Son Güncelleme: ${dayjs(lastUpdate).format('HH:mm:ss')}`}
                                    sx={{ 
                                        bgcolor: alpha('#fff', 0.25),
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        height: 32,
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        '&:hover': {
                                            bgcolor: alpha('#fff', 0.35)
                                        }
                                    }}
                                />
                            )}
                            <Tooltip title="Yenile" arrow>
                                <IconButton 
                                    onClick={() => loadGateways(false)}
                                    sx={{ 
                                        color: 'white',
                                        bgcolor: alpha('#fff', 0.25),
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        width: 40,
                                        height: 40,
                                        '&:hover': { 
                                            bgcolor: alpha('#fff', 0.35),
                                            transform: 'rotate(180deg)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>

                <Grid container spacing={2.5}>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                bgcolor: alpha('#fff', 0.2), 
                                backdropFilter: 'blur(15px)',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha('#fff', 0.3),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                    bgcolor: alpha('#fff', 0.25)
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.5}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha('#fff', 0.2),
                                            width: 'fit-content'
                                        }}
                                    >
                                        <RouterIcon sx={{ fontSize: '1.75rem' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.95, display: 'block', mb: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                                            Toplam Gateway
                                        </Typography>
                                        <Typography variant="h4" fontWeight="800" sx={{ fontSize: '1.75rem' }}>
                                            {stats.total}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                bgcolor: alpha('#fff', 0.2), 
                                backdropFilter: 'blur(15px)',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha('#fff', 0.3),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                    bgcolor: alpha('#fff', 0.25)
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.5}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha('#4caf50', 0.3),
                                            width: 'fit-content'
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: '1.75rem', color: '#4caf50' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.95, display: 'block', mb: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                                            Aktif
                                        </Typography>
                                        <Typography variant="h4" fontWeight="800" sx={{ fontSize: '1.75rem' }}>
                                            {stats.active}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                bgcolor: alpha('#fff', 0.2), 
                                backdropFilter: 'blur(15px)',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha('#fff', 0.3),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                    bgcolor: alpha('#fff', 0.25)
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.5}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha('#9e9e9e', 0.3),
                                            width: 'fit-content'
                                        }}
                                    >
                                        <ErrorIcon sx={{ fontSize: '1.75rem', color: '#9e9e9e' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.95, display: 'block', mb: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                                            Pasif
                                        </Typography>
                                        <Typography variant="h4" fontWeight="800" sx={{ fontSize: '1.75rem' }}>
                                            {stats.inactive}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                bgcolor: alpha('#fff', 0.2), 
                                backdropFilter: 'blur(15px)',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha('#fff', 0.3),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                    bgcolor: alpha('#fff', 0.25)
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.5}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha('#ff9800', 0.3),
                                            width: 'fit-content'
                                        }}
                                    >
                                        <WarningIcon sx={{ fontSize: '1.75rem', color: '#ff9800' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.95, display: 'block', mb: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                                            Düşük Pil
                                        </Typography>
                                        <Typography variant="h4" fontWeight="800" sx={{ fontSize: '1.75rem' }}>
                                            {stats.lowBattery}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                bgcolor: alpha('#fff', 0.2), 
                                backdropFilter: 'blur(15px)',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha('#fff', 0.3),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                    bgcolor: alpha('#fff', 0.25)
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.5}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha('#fff', 0.2),
                                            width: 'fit-content'
                                        }}
                                    >
                                        <BatteryStdIcon sx={{ fontSize: '1.75rem' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.95, display: 'block', mb: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                                            Ort. Batarya
                                        </Typography>
                                        <Typography variant="h4" fontWeight="800" sx={{ fontSize: '1.75rem' }}>
                                            %{stats.avgBattery}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                bgcolor: alpha('#fff', 0.2), 
                                backdropFilter: 'blur(15px)',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha('#fff', 0.3),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                    bgcolor: alpha('#fff', 0.25)
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.5}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha('#fff', 0.2),
                                            width: 'fit-content'
                                        }}
                                    >
                                        <SignalCellularAltIcon sx={{ fontSize: '1.75rem' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.95, display: 'block', mb: 0.5, fontSize: '0.75rem', fontWeight: 600 }}>
                                            Toplam Cihaz
                                        </Typography>
                                        <Typography variant="h4" fontWeight="800" sx={{ fontSize: '1.75rem' }}>
                                            {stats.totalDevices}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                </Box>
            </Paper>

            {/* Filtreleme ve Arama */}
            <Paper elevation={2} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        placeholder="Gateway ara..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flexGrow: 1, maxWidth: { md: 300 } }}
                        InputProps={{
                            startAdornment: <MapIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Durum</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Durum"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tümü</MenuItem>
                            <MenuItem value="active">Aktif</MenuItem>
                            <MenuItem value="inactive">Pasif</MenuItem>
                            <MenuItem value="low_battery">Düşük Pil</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Batarya</InputLabel>
                        <Select
                            value={batteryFilter}
                            label="Batarya"
                            onChange={(e) => setBatteryFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tümü</MenuItem>
                            <MenuItem value="low">Düşük (&lt;20%)</MenuItem>
                            <MenuItem value="medium">Orta (20-50%)</MenuItem>
                            <MenuItem value="high">Yüksek (&gt;50%)</MenuItem>
                        </Select>
                    </FormControl>
                    <Chip
                        icon={<FilterListIcon />}
                        label={`${filteredGateways.length} / ${gateways.length}`}
                        color="primary"
                        variant="outlined"
                    />
                </Stack>
            </Paper>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                height: '100%',
                width: '100%'
            }}>
                {/* Sol Panel - Gateway Listesi */}
                <Box sx={{
                    width: { xs: '100%', md: '280px' },
                    height: '100%',
                    display: 'flex',
                    minHeight: '500px',
                    flexShrink: 0
                }}>
                    <GatewayList
                        gateways={filteredGateways}
                        selectedGateway={selectedGateway}
                        onGatewaySelect={handleGatewaySelect}
                    />
                </Box>

                {/* Orta Panel - Harita */}
                <Box sx={{
                    flex: '1 1 auto',
                    height: '100%',
                    minHeight: '500px',
                    display: 'flex'
                }}>
                    <Paper
                        elevation={2}
                        sx={{
                            height: '100%',
                            width: '100%',
                            minHeight: '500px',
                            maxHeight: 'calc(100vh - 150px)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            bgcolor: '#e0e0e0',
                            border: '2px solid #ccc',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, bgcolor: 'white', p: 1, borderRadius: 1, boxShadow: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                Canlı Harita Görünümü
                            </Typography>
                        </Box>
                        <MapComponent
                            gateways={filteredGateways}
                            selectedGateway={selectedGateway}
                            onMarkerClick={handleMarkerClick}
                            loading={loading}
                            error={error}
                            isRefreshing={isRefreshing}
                        />
                    </Paper>
                </Box>

                {/* Sağ Panel - Gateway Detayları */}
                <Box sx={{
                    width: { xs: '100%', md: '350px' },
                    height: '100%',
                    display: 'flex',
                    minHeight: '500px',
                    flexShrink: 0
                }}>
                    <GatewayDetailCard gateway={selectedGateway} />
                </Box>
            </Box>
            </Box>
        </Box>
    );
};

export default LiveMap;
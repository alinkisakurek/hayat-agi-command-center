import React from 'react';
import {
    Paper,
    Box,
    Typography,
    Stack,
    Chip,
    Divider,
    LinearProgress,
    Grid
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DevicesIcon from '@mui/icons-material/Devices';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const GatewayDetailCard = ({ gateway }) => {
    if (!gateway) {
        return (
            <Paper
                elevation={2}
                sx={{
                    height: '100%',
                    borderRadius: 2,
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default'
                }}
            >
                <Typography variant="body1" color="text.secondary" align="center">
                    Detayları görmek için bir gateway seçin
                </Typography>
            </Paper>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'low_battery': return 'warning';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'inactive': return 'Pasif';
            case 'low_battery': return 'Düşük Pil';
            default: return 'Bilinmiyor';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircleIcon />;
            case 'inactive': return <ErrorIcon />;
            case 'low_battery': return <WarningIcon />;
            default: return null;
        }
    };

    const getBatteryColor = (battery) => {
        if (battery >= 50) return '#4caf50';
        if (battery >= 20) return '#ff9800';
        return '#f44336';
    };

    const formatUptime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}s ${minutes}dk`;
        }
        return `${minutes}dk`;
    };

    const formatLastSeen = (date) => {
        if (!date) return 'Bilinmiyor';
        const lastSeen = new Date(date);
        const now = new Date();
        const diffSeconds = Math.floor((now - lastSeen) / 1000);

        if (diffSeconds < 60) return 'Az önce';
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} dakika önce`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} saat önce`;
        return `${Math.floor(diffSeconds / 86400)} gün önce`;
    };

    return (
        <Paper
            elevation={2}
            sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Başlık */}
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <RouterIcon />
                    <Typography variant="h6" fontWeight="bold">
                        {gateway.name}
                    </Typography>
                </Stack>
            </Box>

            <Box sx={{ p: 2, flex: 1 }}>
                {/* Durum */}
                <Box sx={{ mb: 2 }}>
                    <Chip
                        icon={getStatusIcon(gateway.status)}
                        label={getStatusLabel(gateway.status)}
                        color={getStatusColor(gateway.status)}
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Batarya */}
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <BatteryStdIcon sx={{ color: getBatteryColor(gateway.battery) }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                            Batarya Durumu
                        </Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={gateway.battery}
                            sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: getBatteryColor(gateway.battery)
                                }
                            }}
                        />
                        <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 45 }}>
                            %{gateway.battery}
                        </Typography>
                    </Box>
                </Box>

                {/* Konum */}
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <LocationOnIcon color="primary" />
                        <Typography variant="subtitle2" fontWeight="bold">
                            Konum
                        </Typography>
                    </Stack>
                    {gateway.address && (gateway.address.street || gateway.address.city) ? (
                        <Box>
                            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
                                {gateway.address.street || ''} {gateway.address.buildingNo || ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {gateway.address.district || ''} {gateway.address.district && gateway.address.city ? ', ' : ''}
                                {gateway.address.city || ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {gateway.address.province || ''} {gateway.address.postalCode ? `(${gateway.address.postalCode})` : ''}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="caption" color="text.secondary" display="block">
                                Enlem: {gateway.location?.lat?.toFixed(6) || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Boylam: {gateway.location?.lng?.toFixed(6) || 'N/A'}
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Enlem: {gateway.location?.lat?.toFixed(6) || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Boylam: {gateway.location?.lng?.toFixed(6) || 'N/A'}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Diğer Bilgiler */}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                            <SignalCellularAltIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Sinyal Kalitesi
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {gateway.signal_quality === 'strong' ? 'Güçlü' :
                                    gateway.signal_quality === 'medium' ? 'Orta' :
                                        gateway.signal_quality === 'weak' ? 'Zayıf' : 'Yok'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                            <DevicesIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Bağlı Cihazlar
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {gateway.connected_devices || 0}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                            <AccessTimeIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Çalışma Süresi
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formatUptime(gateway.uptime || 0)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                            <AccessTimeIcon sx={{ color: 'text.secondary', mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Son Görülme
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                                {formatLastSeen(gateway.last_seen)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default GatewayDetailCard;
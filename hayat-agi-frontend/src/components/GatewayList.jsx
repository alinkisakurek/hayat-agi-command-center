import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Typography,
    Paper,
    Stack,
    Divider,
    LinearProgress,
    alpha,
    Card,
    CardContent
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const GatewayList = ({ gateways, selectedGateway, onGatewaySelect }) => {
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

    const getBatteryColor = (battery) => {
        if (battery >= 50) return 'success';
        if (battery >= 20) return 'warning';
        return 'error';
    };

    return (
        <Paper
            elevation={4}
            sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
            }}
        >
            <Box 
                sx={{ 
                    p: 2.5, 
                    background: 'linear-gradient(135deg, #004CB4 0%, #0063E5 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(0, 76, 180, 0.3)'
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: alpha('#fff', 0.2),
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <RouterIcon sx={{ fontSize: '1.5rem' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.125rem', mb: 0.25 }}>
                            Gateway Listesi
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.95, fontSize: '0.75rem' }}>
                            {gateways.length} {gateways.length === 1 ? 'cihaz' : 'cihaz'} bulundu
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
                {gateways.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                bgcolor: alpha('#004CB4', 0.05),
                                border: '2px dashed',
                                borderColor: alpha('#004CB4', 0.3)
                            }}
                        >
                            <RouterIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                            <Typography variant="body1" color="text.secondary" fontWeight={600}>
                                Henüz gateway bulunmuyor
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                Yeni gateway eklemek için yönetim paneline gidin
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <List sx={{ p: 1.5, '& .MuiListItem-root': { mb: 1 } }}>
                        {gateways.map((gateway, index) => {
                            const isSelected = selectedGateway?._id === gateway._id;
                            const batteryColor = getBatteryColor(gateway.battery) === 'success' ? '#4caf50' :
                                getBatteryColor(gateway.battery) === 'warning' ? '#ff9800' : '#f44336';

                            return (
                                <Card
                                    key={gateway._id}
                                    elevation={isSelected ? 4 : 1}
                                    sx={{
                                        borderRadius: 2.5,
                                        overflow: 'hidden',
                                        border: isSelected ? '2px solid' : '1px solid',
                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                        bgcolor: isSelected ? alpha('#004CB4', 0.05) : 'background.paper',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 4,
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                    onClick={() => onGatewaySelect(gateway)}
                                >
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    bgcolor: isSelected ? 'primary.main' : alpha('#004CB4', 0.1),
                                                    color: isSelected ? 'white' : 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minWidth: 40,
                                                    height: 40
                                                }}
                                            >
                                                <RouterIcon sx={{ fontSize: '1.25rem' }} />
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        fontWeight={isSelected ? 700 : 600}
                                                        sx={{ 
                                                            fontSize: '0.95rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {gateway.name}
                                                    </Typography>
                                                    <Chip
                                                        icon={gateway.status === 'active' ? <CheckCircleIcon /> :
                                                            gateway.status === 'inactive' ? <ErrorIcon /> : <WarningIcon />}
                                                        label={getStatusLabel(gateway.status)}
                                                        color={getStatusColor(gateway.status)}
                                                        size="small"
                                                        sx={{ 
                                                            height: 22, 
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            '& .MuiChip-icon': {
                                                                fontSize: '0.875rem'
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                                
                                                {/* Batarya Progress Bar */}
                                                <Box sx={{ mb: 1 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                        <BatteryStdIcon sx={{ fontSize: '1rem', color: batteryColor }} />
                                                        <Typography variant="caption" fontWeight={600} sx={{ minWidth: 35 }}>
                                                            %{gateway.battery || 0}
                                                        </Typography>
                                                        <Box sx={{ flex: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={gateway.battery || 0}
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    bgcolor: alpha(batteryColor, 0.1),
                                                                    '& .MuiLinearProgress-bar': {
                                                                        bgcolor: batteryColor,
                                                                        borderRadius: 3
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                                <Divider sx={{ my: 1 }} />

                                                {/* Alt Bilgiler */}
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <SignalCellularAltIcon 
                                                            sx={{ 
                                                                fontSize: '0.875rem', 
                                                                color: gateway.signal_quality === 'strong' ? '#4caf50' :
                                                                    gateway.signal_quality === 'medium' ? '#ff9800' : '#f44336'
                                                            }} 
                                                        />
                                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                            {gateway.signal_quality === 'strong' ? 'Güçlü' :
                                                                gateway.signal_quality === 'medium' ? 'Orta' :
                                                                    gateway.signal_quality === 'weak' ? 'Zayıf' : 'Yok'}
                                                        </Typography>
                                                    </Stack>
                                                    {gateway.location && (
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <LocationOnIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                                Konum
                                                            </Typography>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Paper>
    );
};

export default GatewayList;
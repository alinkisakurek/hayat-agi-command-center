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
    Stack
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

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
            elevation={2}
            sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                    Gateway Listesi
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {gateways.length} cihaz bulundu
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {gateways.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Henüz gateway bulunmuyor
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {gateways.map((gateway) => {
                            const isSelected = selectedGateway?._id === gateway._id;

                            return (
                                <ListItem key={gateway._id} disablePadding>
                                    <ListItemButton
                                        onClick={() => onGatewaySelect(gateway)}
                                        selected={isSelected}
                                        sx={{
                                            borderLeft: isSelected ? 4 : 0,
                                            borderColor: 'primary.main',
                                            bgcolor: isSelected ? 'action.selected' : 'transparent',
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            },
                                            py: 1.5,
                                            px: 2
                                        }}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                                <RouterIcon fontSize="small" color="primary" />
                                                <ListItemText
                                                    primary={gateway.name}
                                                    primaryTypographyProps={{
                                                        fontWeight: isSelected ? 'bold' : 'medium',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                                <Chip
                                                    label={getStatusLabel(gateway.status)}
                                                    color={getStatusColor(gateway.status)}
                                                    size="small"
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            </Stack>

                                            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <BatteryStdIcon
                                                        fontSize="small"
                                                        sx={{
                                                            fontSize: '1rem',
                                                            color: getBatteryColor(gateway.battery) === 'success' ? '#4caf50' :
                                                                getBatteryColor(gateway.battery) === 'warning' ? '#ff9800' : '#f44336'
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        %{gateway.battery}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <SignalCellularAltIcon fontSize="small" sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {gateway.signal_quality === 'strong' ? 'Güçlü' :
                                                            gateway.signal_quality === 'medium' ? 'Orta' :
                                                                gateway.signal_quality === 'weak' ? 'Zayıf' : 'Yok'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Paper>
    );
};

export default GatewayList;
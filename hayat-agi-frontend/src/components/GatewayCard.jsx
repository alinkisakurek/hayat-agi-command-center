import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Divider } from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const GatewayCard = ({ gateway }) => {

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

    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 3,
                transition: '0.3s',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    borderColor: 'primary.main'
                }
            }}
        >
            <CardContent>
                {/* Üst Kısım: İsim ve Durum */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            p: 1,
                            borderRadius: 2,
                            display: 'flex'
                        }}>
                            <RouterIcon />
                        </Box>
                        <Typography variant="h6" component="div" fontWeight="bold">
                            {gateway.name}
                        </Typography>
                    </Stack>

                    <Chip
                        label={getStatusLabel(gateway.status)}
                        color={getStatusColor(gateway.status)}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Divider sx={{ my: 1.5 }} />


                <Stack spacing={1.5}>


                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            {gateway.location ?
                                `${gateway.location.lat.toFixed(4)}, ${gateway.location.lng.toFixed(4)}` :
                                'Konum Yok'}
                        </Typography>
                    </Box>


                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <BatteryStdIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            Batarya: %{gateway.battery || 0}
                        </Typography>
                    </Box>


                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <SignalCellularAltIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            Sinyal: {gateway.signal_quality || 'Orta'}
                        </Typography>
                    </Box>

                </Stack>
            </CardContent>
        </Card>
    );
};

export default GatewayCard;
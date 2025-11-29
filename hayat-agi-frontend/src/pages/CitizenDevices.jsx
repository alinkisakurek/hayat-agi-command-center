import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Stack, LinearProgress, Chip, Button, Divider } from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditLocationIcon from '@mui/icons-material/EditLocation';

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

const CitizenDevices = () => {
    const getBatteryColor = (level) => {
        if (level > 50) return "success";
        if (level > 20) return "warning";
        return "error";
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                    Cihazlarım
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Afet durumuna hazırlık için cihazlarınızın durumunu buradan takip edebilirsiniz.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {myGateways.map((device) => (
                    <Grid item xs={12} md={6} key={device.id}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: 3,
                                border: device.status === 'low_battery' ? '1px solid #d32f2f' : 'none',
                                position: 'relative',
                                overflow: 'visible'
                            }}
                        >
                            <Chip
                                label={device.status === 'active' ? 'Aktif & Hazır' : 'Pil Düşük!'}
                                color={device.status === 'active' ? 'success' : 'error'}
                                icon={device.status === 'active' ? <CheckCircleIcon /> : null}
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    fontWeight: 'bold'
                                }}
                            />

                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        borderRadius: 3
                                    }}>
                                        <RouterIcon fontSize="large" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="800">
                                            {device.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Son görülme: {device.lastSeen}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <BatteryStdIcon color={getBatteryColor(device.battery)} />
                                                <Typography variant="subtitle2" fontWeight="bold">Batarya</Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={device.battery}
                                                color={getBatteryColor(device.battery)}
                                                sx={{ height: 8, borderRadius: 5 }}
                                            />
                                            <Typography variant="body2" sx={{ mt: 1, textAlign: 'right', fontWeight: 'bold' }}>
                                                %{device.battery}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <SmartphoneIcon color="primary" />
                                                <Typography variant="subtitle2" fontWeight="bold">Bağlı Cihaz</Typography>
                                            </Stack>
                                            <Typography variant="h4" fontWeight="800" color="primary.main">
                                                {device.connectedPhones}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Telefon mesh ağına bağlı
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                            <SignalCellularAltIcon color={device.signal === 'strong' ? 'success' : 'warning'} />
                                            <Typography variant="body2">
                                                Mesh Bağlantı Kalitesi:
                                                <Box component="span" fontWeight="bold" sx={{ ml: 1 }}>
                                                    {device.signal === 'strong' ? 'Mükemmel' : 'Orta Seviye'}
                                                </Box>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditLocationIcon />}
                                        fullWidth
                                    >
                                        Konumu Güncelle
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={device.status === 'active' ? 'primary' : 'error'}
                                        fullWidth
                                    >
                                        {device.status === 'active' ? 'Bağlantı Testi Yap' : 'Sorunu Gider'}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CitizenDevices;


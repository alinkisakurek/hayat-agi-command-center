import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import MapComponent from '../components/MapComponent';
import GatewayList from '../components/GatewayList';
import GatewayDetailCard from '../components/GatewayDetailCard';
import { getGateways } from '../api/gatewayService';

const LiveMap = () => {
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', width: '100%', minHeight: '600px', p: 2 }}>
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
                        gateways={gateways}
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
                            gateways={gateways}
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
    );
};

export default LiveMap;
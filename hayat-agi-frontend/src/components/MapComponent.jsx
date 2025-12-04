import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import { Box, Typography, CircularProgress, Alert, Stack } from '@mui/material';
import { Icon } from 'leaflet';

// Leaflet default icon sorununu çöz
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Özel ikonlar oluştur
const createCustomIcon = (status, battery) => {
  let color = '#4caf50'; // Yeşil - Aktif
  if (status === 'inactive') {
    color = '#9e9e9e'; // Gri - Pasif
  } else if (status === 'low_battery' || battery < 20) {
    color = '#f44336'; // Kırmızı - Düşük pil
  } else if (battery < 50) {
    color = '#ff9800'; // Turuncu - Orta pil
  }

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11.045 16 32 16 32s16-20.955 16-32C32 7.163 24.837 0 16 0z" fill="${color}"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <path d="M12 16 L16 20 L20 16 L16 12 Z" fill="${color}"/>
      </svg>
    `)}`,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  });
};

// Harita güncelleme component'i (zoom ve merkez için)
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
};

const MapComponent = ({ gateways = [], selectedGateway, onGatewayClick, onMarkerClick, loading, error, isRefreshing = false }) => {
  // İstanbul merkez koordinatları
  const defaultCenter = [41.0082, 28.9784];
  const defaultZoom = 13;
  const [isMounted, setIsMounted] = useState(false);

  // Client-side'da çalıştığından emin ol
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gateway'lerden koordinatları çıkar
  const validGateways = gateways.filter(
    (gw) => gw.location && gw.location.lat && gw.location.lng
  );

  // Tüm gateway'lerin merkezini hesapla (eğer gateway varsa)
  const calculateCenter = () => {
    if (validGateways.length === 0) return defaultCenter;
    
    const avgLat = validGateways.reduce((sum, gw) => sum + gw.location.lat, 0) / validGateways.length;
    const avgLng = validGateways.reduce((sum, gw) => sum + gw.location.lng, 0) / validGateways.length;
    return [avgLat, avgLng];
  };

  const mapCenter = validGateways.length > 0 ? calculateCenter() : defaultCenter;

  if (error) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="body1" fontWeight="bold">Harita Yüklenemedi</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      id="map-wrapper"
      sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative', 
        borderRadius: 2, 
        overflow: 'hidden', 
        minHeight: '500px',
        bgcolor: '#e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {loading && gateways.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            borderRadius: 2
          }}
        >
          <Stack direction="column" spacing={2} alignItems="center">
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Harita yükleniyor...
            </Typography>
          </Stack>
        </Box>
      )}
      
      {isRefreshing && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            p: 1,
            borderRadius: 1,
            boxShadow: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CircularProgress size={16} />
          <Typography variant="caption" color="text.secondary">
            Güncelleniyor...
          </Typography>
        </Box>
      )}

      <Box sx={{ flex: 1, position: 'relative', minHeight: '500px' }}>
        <MapContainer
          key="main-map"
          center={mapCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%', zIndex: 1, minHeight: '500px', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          scrollWheelZoom={true}
          whenReady={(mapInstance) => {
            // Harita hazır olduğunda invalidateSize çağır
            const map = mapInstance.target;
            setTimeout(() => {
              map.invalidateSize();
            }, 500);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Seçili gateway'i merkeze al */}
          {selectedGateway?.location && (
            <MapUpdater
              center={[selectedGateway.location.lat, selectedGateway.location.lng]}
              zoom={15}
            />
          )}

          {/* Gateway marker'ları */}
          {validGateways.map((gateway) => {
            const isSelected = selectedGateway?._id === gateway._id;
            const icon = createCustomIcon(gateway.status, gateway.battery || 0);
            
            // Key'e status ve battery ekle ki değişikliklerde icon güncellensin
            const markerKey = `${gateway._id}-${gateway.status}-${gateway.battery}`;

            return (
              <Marker
                key={markerKey}
                position={[gateway.location.lat, gateway.location.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    if (onMarkerClick) {
                      onMarkerClick(gateway);
                    } else if (onGatewayClick) {
                      onGatewayClick(gateway);
                    }
                  },
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {gateway.name}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Durum: {gateway.status === 'active' ? 'Aktif' :
                             gateway.status === 'inactive' ? 'Pasif' : 'Düşük Pil'}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Batarya: %{gateway.battery || 0}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                      Detaylar için tıklayın
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapComponent;

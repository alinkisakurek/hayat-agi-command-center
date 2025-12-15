import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Stack,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { createGateway } from '../../api/gatewayService';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

const LocationPicker = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const steps = ['Kimlik', 'Konum', 'Onay'];

const AddDeviceWizard = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [identity, setIdentity] = useState({
    serialNumber: '',
    name: ''
  });
  const [locationMethod, setLocationMethod] = useState(0); // 0: Haritadan seç, 1: Adres gir
  const [selectedPosition, setSelectedPosition] = useState(null); // { lat, lng }
  const [address, setAddress] = useState({
    street: '',
    buildingNo: '',
    doorNo: '',
    district: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isIdentityValid = identity.serialNumber.trim() && identity.name.trim();
  const hasLocation = !!selectedPosition;

  const handleNext = () => {
    if (activeStep === 0 && !isIdentityValid) return;
    if (activeStep === 1 && !hasLocation) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinish = async () => {
    if (!isIdentityValid || !hasLocation) return;

    try {
      setIsSubmitting(true);
      const gatewayData = {
        name: identity.name.trim(),
        serialNumber: identity.serialNumber.trim(),
        status: 'active',
        location: {
          lat: selectedPosition.lat,
          lng: selectedPosition.lng
        },
        address: {
          street: address.street.trim(),
          buildingNo: address.buildingNo.trim(),
          doorNo: address.doorNo.trim(),
          district: address.district.trim(),
          city: address.city.trim(),
          province: address.province.trim(),
          postalCode: address.postalCode.trim(),
          formatted: resolvedAddress
        }
      };

      await createGateway(gatewayData);
      navigate('/panel/cihazlarim');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Cihaz kaydedilirken hata:', err);
      alert(err?.response?.data?.message || err?.message || 'Cihaz kaydedilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReverseGeocode = async (lat, lng) => {
    setGeocodingError('');
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=tr&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'HayatAgiApp/1.0',
          'Accept-Language': 'tr,en'
        }
      });
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        setAddress((prev) => ({
          ...prev,
          street: addr.road || addr.pedestrian || prev.street,
          buildingNo: addr.house_number || prev.buildingNo,
          district: addr.suburb || addr.neighbourhood || addr.village || prev.district,
          city: addr.town || addr.city_district || addr.city || addr.county || prev.city,
          province: addr.state || prev.province,
          postalCode: addr.postcode || prev.postalCode
        }));
        setResolvedAddress(data.display_name || '');
      } else {
        setResolvedAddress('');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Reverse geocoding hatası:', error);
      setGeocodingError('Seçilen konumun adresi alınırken bir hata oluştu.');
    }
  };

  const handleGeocodeAddress = async () => {
    if (!address.street.trim() || !address.province.trim()) {
      setGeocodingError('Lütfen en azından Sokak/Cadde ve İl bilgilerini girin.');
      return;
    }

    setIsGeocoding(true);
    setGeocodingError('');

    try {
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.buildingNo) parts.push(`No: ${address.buildingNo}`);
      if (address.doorNo) parts.push(`Daire: ${address.doorNo}`);
      if (address.district) parts.push(address.district);
      if (address.city) parts.push(address.city);
      if (address.province) parts.push(address.province);
      if (address.postalCode) parts.push(address.postalCode);
      parts.push('Türkiye');

      const q = parts.join(', ');
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&limit=1&countrycodes=tr&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'HayatAgiApp/1.0',
          'Accept-Language': 'tr,en'
        }
      });
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setSelectedPosition({ lat, lng });
        setResolvedAddress(result.display_name || q);
        setGeocodingError('');
      } else {
        setGeocodingError('Adres bulunamadı. Lütfen adresi kontrol edin veya daha detaylı girin.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Geocoding hatası:', error);
      setGeocodingError('Adres aranırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Cihaz Seri Numarası"
              value={identity.serialNumber}
              onChange={(e) =>
                setIdentity((prev) => ({ ...prev, serialNumber: e.target.value }))
              }
              required
            />
            <TextField
              fullWidth
              label="Cihaz İsmi"
              value={identity.name}
              onChange={(e) =>
                setIdentity((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </Stack>
        );
      case 1:
        return (
          <Box>
            <Tabs
              value={locationMethod}
              onChange={(_, value) => setLocationMethod(value)}
              sx={{ mb: 2 }}
            >
              <Tab label="Haritadan Seç" />
              <Tab label="Adres Gir" />
            </Tabs>

            {locationMethod === 0 && (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Harita üzerinde bir noktaya tıklayarak cihazınızın konumunu belirleyin.
                </Typography>
                {isMounted && (
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: '1px solid rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      height: 360
                    }}
                  >
                    <MapContainer
                      center={[41.0082, 28.9784]}
                      zoom={12}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker
                        position={selectedPosition}
                        onPositionChange={(pos) => {
                          setSelectedPosition(pos);
                          handleReverseGeocode(pos.lat, pos.lng);
                        }}
                      />
                    </MapContainer>
                  </Box>
                )}
                {selectedPosition && (
                  <Typography variant="body2" color="text.primary">
                    Seçilen konum: Lat {selectedPosition.lat.toFixed(6)}, Lng{' '}
                    {selectedPosition.lng.toFixed(6)}
                  </Typography>
                )}
                {resolvedAddress && (
                  <Alert severity="info" icon={<LocationOnIcon />} sx={{ borderRadius: 2 }}>
                    Seçilen adres: {resolvedAddress}
                  </Alert>
                )}
                {geocodingError && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {geocodingError}
                  </Alert>
                )}
              </Stack>
            )}

            {locationMethod === 1 && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Sokak/Cadde"
                  value={address.street}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, street: e.target.value }))
                  }
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="Bina No"
                    value={address.buildingNo}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, buildingNo: e.target.value }))
                    }
                  />
                  <TextField
                    fullWidth
                    label="Kapı No"
                    value={address.doorNo}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, doorNo: e.target.value }))
                    }
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Mahalle/Semt/Köy"
                  value={address.district}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, district: e.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label="İlçe"
                  value={address.city}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label="İl"
                  value={address.province}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, province: e.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label="Posta Kodu"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                  }
                />
                <Button
                  variant="contained"
                  onClick={handleGeocodeAddress}
                  disabled={isGeocoding}
                  startIcon={
                    isGeocoding ? <CircularProgress size={18} color="inherit" /> : <LocationOnIcon />
                  }
                >
                  {isGeocoding ? 'Konum Aranıyor...' : 'Konumu Haritada Bul'}
                </Button>
                {selectedPosition && (
                  <Typography variant="body2" color="text.primary">
                    Bulunan konum: Lat {selectedPosition.lat.toFixed(6)}, Lng{' '}
                    {selectedPosition.lng.toFixed(6)}
                  </Typography>
                )}
                {resolvedAddress && (
                  <Alert severity="info" icon={<LocationOnIcon />} sx={{ borderRadius: 2 }}>
                    Bulunan adres: {resolvedAddress}
                  </Alert>
                )}
                {geocodingError && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {geocodingError}
                  </Alert>
                )}
              </Stack>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Cihaz Özeti
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Seri No:</strong> {identity.serialNumber || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>İsim:</strong> {identity.name || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Konum:</strong>{' '}
              {selectedPosition
                ? `Lat ${selectedPosition.lat.toFixed(6)}, Lng ${selectedPosition.lng.toFixed(6)}`
                : '-'}
            </Typography>
            {resolvedAddress && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Adres:</strong> {resolvedAddress}
              </Typography>
            )}
            {!resolvedAddress && (
              <Typography variant="body2" sx={{ mb: 0.5 }} color="text.secondary">
                Adres metni yalnızca haritadan veya adres arama ile belirlenmiş konumlarda
                gösterilir.
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Yeni Cihaz Ekle
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>{renderStepContent()}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Geri
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              İleri
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
            >
              Cihazı Kaydet
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddDeviceWizard;



import React, { useState, useEffect } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Alert, 
    Stack,
    Box,
    CircularProgress,
    Paper,
    Tabs,
    Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createGateway } from '../api/gatewayService';
import SearchIcon from '@mui/icons-material/Search';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

const AddGateway = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        street: '',
        buildingNo: '',
        doorNo: '',
        district: '',
        city: '',
        province: '',
        postalCode: ''
    });
    const [error, setError] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodingError, setGeocodingError] = useState('');
    const [location, setLocation] = useState(null); // { lat, lng }
    const [locationMethod, setLocationMethod] = useState(0); // 0: Haritadan seç, 1: Adres gir
    const [resolvedAddress, setResolvedAddress] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setGeocodingError('');
        setResolvedAddress('');
    };

    // Adres geocoding (adres -> koordinat)
    const handleGeocodeAddress = async () => {
        if (!formData.street.trim() || !formData.province.trim()) {
            setGeocodingError('Lütfen en azından sokak ve il bilgilerini girin.');
            return;
        }

        setIsGeocoding(true);
        setGeocodingError('');

        try {
            // Adres string'ini oluştur - Türkiye için optimize edilmiş format
            let addressParts = [];
            
            // Sokak ve bina no
            if (formData.street) {
                if (formData.buildingNo) {
                    addressParts.push(`${formData.street} ${formData.buildingNo}`);
                } else {
                    addressParts.push(formData.street);
                }
            }
            
            // İlçe (city)
            if (formData.city) {
                addressParts.push(formData.city);
            }
            
            // İl (province)
            if (formData.province) {
                addressParts.push(formData.province);
            }
            
            // Türkiye
            addressParts.push('Türkiye');
            
            const addressString = addressParts.join(', ');
            console.log('Aranan adres:', addressString);
            
            // Nominatim API (OpenStreetMap geocoding)
            // Rate limiting için 1 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=5&countrycodes=tr&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'HayatAgiApp/1.0',
                        'Accept-Language': 'tr,en'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Geocoding sonucu:', data);

            if (data && data.length > 0) {
                // En yüksek önem skoruna sahip sonucu al
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                setLocation({ lat, lng });
                setResolvedAddress(result.display_name || addressString);
                setGeocodingError('');
            } else {
                setGeocodingError(`Adres bulunamadı: "${addressString}". Lütfen adresi kontrol edin. Örnek: "Atatürk Caddesi, Kadıköy, İstanbul, Türkiye"`);
            }
        } catch (error) {
            console.error('Geocoding hatası:', error);
            setGeocodingError(`Adres arama sırasında bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.`);
        } finally {
            setIsGeocoding(false);
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
                setFormData((prev) => ({
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
            console.error('Reverse geocoding hatası:', error);
            setGeocodingError('Seçilen konumun adresi alınırken bir hata oluştu.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.serialNumber.trim()) {
            setError('Lütfen cihaz adı ve seri numarası alanlarını doldurun.');
            return;
        }

        if (!location) {
            setError('Lütfen önce "Konumu Bul" butonuna tıklayarak adresin koordinatlarını alın.');
            return;
        }

        try {
            const gatewayData = {
                name: formData.name.trim(),
                serialNumber: formData.serialNumber.trim(),
                status: 'active',
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                address: {
                    street: formData.street.trim(),
                    buildingNo: formData.buildingNo.trim(),
                    doorNo: formData.doorNo.trim(),
                    district: formData.district.trim(),
                    city: formData.city.trim(),
                    province: formData.province.trim(),
                    postalCode: formData.postalCode.trim()
                }
            };
            await createGateway(gatewayData);
            navigate('/dashboard/gateways');
        } catch (err) {
            console.error('Gateway kaydetme hatası:', err);
            const errorMessage = err?.response?.data?.message || err?.message || 'Kayıt sırasında bir hata oluştu.';
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 3, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Yeni Gateway Ekle
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {geocodingError && <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>{geocodingError}</Alert>}

            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)' }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* Cihaz Bilgileri */}
                        <Box>
                            <Typography variant="h6" fontWeight="700" sx={{ mb: 2, fontSize: '1.125rem' }}>
                                Cihaz Bilgileri
                            </Typography>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Cihaz Adı"
                                    name="name"
                                    fullWidth
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    sx={{ borderRadius: 2 }}
                                />
                                <TextField
                                    label="Seri Numarası"
                                    name="serialNumber"
                                    fullWidth
                                    required
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                    placeholder="Örn: GW-2024-001"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Stack>
                        </Box>

                        {/* Konum / Adres Bilgileri */}
                        <Box>
                            <Tabs
                                value={locationMethod}
                                onChange={(_, value) => {
                                    setLocationMethod(value);
                                    setGeocodingError('');
                                }}
                                sx={{ mb: 2 }}
                            >
                                <Tab label="Haritadan Seç" />
                                <Tab label="Adres Gir" />
                            </Tabs>

                            {locationMethod === 0 && (
                                <Stack spacing={2.5}>
                                    <Typography variant="body2" color="text.secondary">
                                        Harita üzerinde bir noktaya tıklayarak gateway cihazının konumunu belirleyin.
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
                                                    position={location}
                                                    onPositionChange={(pos) => {
                                                        setLocation(pos);
                                                        handleReverseGeocode(pos.lat, pos.lng);
                                                    }}
                                                />
                                            </MapContainer>
                                        </Box>
                                    )}
                                    {location && (
                                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                                            Seçilen konum: Lat {location.lat.toFixed(6)}, Lng{' '}
                                            {location.lng.toFixed(6)}
                                        </Alert>
                                    )}
                                    {resolvedAddress && (
                                        <Alert
                                            severity="info"
                                            icon={<LocationOnIcon />}
                                            sx={{ borderRadius: 2 }}
                                        >
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
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Sokak/Cadde"
                                    name="street"
                                    fullWidth
                                    required
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="Örn: Atatürk Caddesi veya İstiklal Caddesi"
                                    sx={{ borderRadius: 2 }}
                                />
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Bina No"
                                        name="buildingNo"
                                        fullWidth
                                        value={formData.buildingNo}
                                        onChange={handleChange}
                                        placeholder="Örn: 123"
                                        sx={{ borderRadius: 2 }}
                                    />
                                    <TextField
                                        label="Kapı No"
                                        name="doorNo"
                                        fullWidth
                                        value={formData.doorNo || ''}
                                        onChange={(e) => setFormData({ ...formData, doorNo: e.target.value })}
                                        placeholder="Örn: 5 (Opsiyonel)"
                                        sx={{ borderRadius: 2 }}
                                    />
                                </Stack>
                                <TextField
                                    label="Mahalle/Semt/Köy"
                                    name="district"
                                    fullWidth
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder="Örn: Moda, Beşiktaş (Opsiyonel)"
                                    sx={{ borderRadius: 2 }}
                                />
                                <TextField
                                    label="İlçe"
                                    name="city"
                                    fullWidth
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Örn: Kadıköy, Beşiktaş, Şişli"
                                    sx={{ borderRadius: 2 }}
                                />
                                <TextField
                                    label="İl"
                                    name="province"
                                    fullWidth
                                    required
                                    value={formData.province || ''}
                                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                    placeholder="Örn: İstanbul, Ankara, İzmir"
                                    sx={{ borderRadius: 2 }}
                                />
                                <TextField
                                    label="Posta Kodu"
                                    name="postalCode"
                                    fullWidth
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="Örn: 34000"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Stack>
                            )}
                        </Box>

                        {/* Konum Bul Butonu (Adres Gir modu) */}
                        {locationMethod === 1 && (
                            <Box>
                                <Button
                                    variant="outlined"
                                    onClick={handleGeocodeAddress}
                                    disabled={isGeocoding || !formData.street.trim() || !formData.province.trim()}
                                    startIcon={isGeocoding ? <CircularProgress size={20} /> : <SearchIcon />}
                                    fullWidth
                                    size="large"
                                    sx={{ 
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600
                                    }}
                                >
                                    {isGeocoding ? 'Konum Aranıyor...' : 'Konumu Bul'}
                                </Button>
                                {location && (
                                    <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                                        Konum bulundu: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                    </Alert>
                                )}
                                {resolvedAddress && (
                                    <Alert
                                        severity="info"
                                        icon={<LocationOnIcon />}
                                        sx={{ mt: 2, borderRadius: 2 }}
                                    >
                                        Bulunan adres: {resolvedAddress}
                                    </Alert>
                                )}
                            </Box>
                        )}

                        {/* Kaydet Butonu */}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large"
                            fullWidth
                            disabled={!location}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: '1rem'
                            }}
                        >
                            Gateway'i Kaydet
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default AddGateway;
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
import { createGateway } from '../api/gatewayService'; // API servisini import et
import SearchIcon from '@mui/icons-material/Search';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Leaflet ikon hatasını düzelten kod bloğu
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

// Haritada tıklanan yeri alan bileşen
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

    // FORM STATE - Backend ile %100 Uyumlu İsimlendirme
    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        street: '',        // Cadde/Sokak
        buildingNo: '',    // Bina No
        doorNo: '',        // Kapı No (Yeni)
        neighborhood: '',  // Mahalle (Yeni)
        district: '',      // İlçe (Eskiden city diyorduk, düzelttik)
        province: '',      // İl
        postalCode: ''
    });

    const [error, setError] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodingError, setGeocodingError] = useState('');
    const [location, setLocation] = useState(null); // { lat, lng }
    const [locationMethod, setLocationMethod] = useState(1); // Varsayılan: Adres Gir (1)
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

    // 1. ADRES -> KOORDİNAT BULMA (Geocoding)
    const handleGeocodeAddress = async () => {
        // En azından Sokak, İlçe ve İl girilmeli
        if (!formData.street.trim() || !formData.district.trim() || !formData.province.trim()) {
            setGeocodingError('Lütfen doğru sonuç için Sokak, İlçe ve İl bilgilerini girin.');
            return;
        }

        setIsGeocoding(true);
        setGeocodingError('');

        try {
            // Arama metnini oluştur: "Sokak No, Mahalle, İlçe, İl, Türkiye"
            let addressParts = [];

            // Sokak + Bina No
            if (formData.street) {
                let str = formData.street;
                if (formData.buildingNo) str += ` ${formData.buildingNo}`;
                addressParts.push(str);
            }

            // Mahalle (Konum bulmada çok etkili)
            if (formData.neighborhood) {
                addressParts.push(formData.neighborhood);
            }

            // İlçe
            if (formData.district) {
                addressParts.push(formData.district);
            }

            // İl
            if (formData.province) {
                addressParts.push(formData.province);
            }

            addressParts.push('Türkiye');

            const addressString = addressParts.join(', ');
            console.log('🔍 Aranan adres:', addressString);

            // Nominatim API İsteği
            // (1 saniye bekleme - Rate Limit için)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1&countrycodes=tr&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'HayatAgiApp/1.0',
                        'Accept-Language': 'tr,en'
                    }
                }
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                setLocation({ lat, lng });
                setResolvedAddress(result.display_name || addressString);
            } else {
                setGeocodingError(`Adres bulunamadı. Lütfen mahalle veya sokak ismini kontrol edip tekrar deneyin.`);
            }
        } catch (error) {
            console.error('Geocoding hatası:', error);
            setGeocodingError('Adres servisine bağlanılamadı.');
        } finally {
            setIsGeocoding(false);
        }
    };

    // 2. KOORDİNAT -> ADRES ÇÖZME (Reverse Geocoding) - Haritadan seçince çalışır
    const handleReverseGeocode = async (lat, lng) => {
        setGeocodingError('');
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=tr&addressdetails=1`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'HayatAgiApp/1.0' }
            });
            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;
                // Gelen veriyi form alanlarına akıllıca dağıt
                setFormData((prev) => ({
                    ...prev,
                    street: addr.road || addr.pedestrian || prev.street,
                    buildingNo: addr.house_number || prev.buildingNo,
                    neighborhood: addr.suburb || addr.neighbourhood || addr.quarter || prev.neighborhood,
                    district: addr.town || addr.city_district || addr.county || prev.district,
                    province: addr.province || addr.state || addr.city || prev.province,
                    postalCode: addr.postcode || prev.postalCode
                }));
                setResolvedAddress(data.display_name || '');
            }
        } catch (error) {
            console.error('Reverse geocoding hatası:', error);
        }
    };

    // 3. KAYDETME İŞLEMİ
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.serialNumber.trim()) {
            setError('Lütfen cihaz adı ve seri numarası alanlarını doldurun.');
            return;
        }

        if (!location) {
            setError('Lütfen önce "Konumu Bul" butonuna tıklayın veya haritadan bir yer seçin.');
            return;
        }

        try {
            // Backend'e gidecek veri paketi
            const gatewayData = {
                name: formData.name.trim(),
                serialNumber: formData.serialNumber.trim(),
                status: 'active',
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                // Adres objesi (Schema ile birebir aynı)
                address: {
                    street: formData.street.trim(),
                    buildingNo: formData.buildingNo.trim(),
                    doorNo: formData.doorNo.trim(),
                    neighborhood: formData.neighborhood.trim(), // Mahalle
                    district: formData.district.trim(),         // İlçe
                    province: formData.province.trim(),         // İl
                    postalCode: formData.postalCode.trim()
                }
            };

            await createGateway(gatewayData);

            // Başarılıysa listeye dön
            navigate('/dashboard/gateways');

        } catch (err) {
            console.error('Gateway kaydetme hatası:', err);
            const errorMessage = err?.response?.data?.message || err?.message || 'Kayıt sırasında bir hata oluştu.';
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 3 }}>
                Yeni Gateway Ekle
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {geocodingError && <Alert severity="warning" sx={{ mb: 2 }}>{geocodingError}</Alert>}

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>

                        {/* CİHAZ BİLGİLERİ */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Cihaz Bilgileri</Typography>
                            <Stack spacing={2}>
                                <TextField
                                    label="Cihaz Adı"
                                    name="name"
                                    fullWidth required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Seri Numarası"
                                    name="serialNumber"
                                    fullWidth required
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                />
                            </Stack>
                        </Box>

                        {/* KONUM SEÇİMİ */}
                        <Box>
                            <Tabs value={locationMethod} onChange={(_, v) => setLocationMethod(v)} sx={{ mb: 2 }}>
                                <Tab label="Haritadan Seç" />
                                <Tab label="Adres Gir" />
                            </Tabs>

                            {/* HARİTA MODU */}
                            {locationMethod === 0 && (
                                <Stack spacing={2}>
                                    <Alert severity="info">Harita üzerinde cihazın bulunduğu yere tıklayın.</Alert>
                                    {isMounted && (
                                        <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                                            <MapContainer center={[41.0082, 28.9784]} zoom={11} style={{ height: '100%' }}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationPicker position={location} onPositionChange={(pos) => {
                                                    setLocation(pos);
                                                    handleReverseGeocode(pos.lat, pos.lng);
                                                }} />
                                            </MapContainer>
                                        </Box>
                                    )}
                                </Stack>
                            )}

                            {/* ADRES GİRME MODU - Form Alanları */}
                            {locationMethod === 1 && (
                                <Stack spacing={2}>
                                    <TextField
                                        label="Sokak / Cadde"
                                        name="street"
                                        fullWidth required
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="Örn: Atatürk Caddesi"
                                    />

                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Bina No"
                                            name="buildingNo"
                                            fullWidth
                                            value={formData.buildingNo}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            label="Kapı No"
                                            name="doorNo"
                                            fullWidth
                                            value={formData.doorNo}
                                            onChange={handleChange}
                                        />
                                    </Stack>

                                    <TextField
                                        label="Mahalle"
                                        name="neighborhood"
                                        fullWidth required
                                        value={formData.neighborhood}
                                        onChange={handleChange}
                                        placeholder="Örn: Caferağa Mah."
                                    />

                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="İlçe"
                                            name="district"
                                            fullWidth required
                                            value={formData.district}
                                            onChange={handleChange}
                                            placeholder="Örn: Kadıköy"
                                        />
                                        <TextField
                                            label="İl"
                                            name="province"
                                            fullWidth required
                                            value={formData.province}
                                            onChange={handleChange}
                                            placeholder="Örn: İstanbul"
                                        />
                                    </Stack>
                                </Stack>
                            )}
                        </Box>

                        {/* KONUM BUL BUTONU & BİLGİLER */}
                        {locationMethod === 1 && (
                            <Button
                                variant="outlined"
                                onClick={handleGeocodeAddress}
                                disabled={isGeocoding}
                                startIcon={isGeocoding ? <CircularProgress size={20} /> : <SearchIcon />}
                                fullWidth
                                size="large"
                            >
                                {isGeocoding ? 'Konum Aranıyor...' : 'Konumu Bul (Koordinatları Getir)'}
                            </Button>
                        )}

                        {location && (
                            <Alert severity="success" icon={<LocationOnIcon />}>
                                Konum Başarıyla Seçildi: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                                <br />
                                <small>{resolvedAddress}</small>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={!location}
                            fullWidth
                            sx={{ py: 1.5, fontWeight: 'bold' }}
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
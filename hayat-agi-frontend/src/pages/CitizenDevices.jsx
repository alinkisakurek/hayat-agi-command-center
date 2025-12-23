import React, { useEffect, useState } from 'react';
import { getUserGateways, updateGateway, deleteGateway } from '../api/gatewayService';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Chip,
  Button,
  Divider,
  Avatar,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search'; // Yeni ikonlar
import MapIcon from '@mui/icons-material/Map';
import QrCodeIcon from '@mui/icons-material/QrCode';

const CitizenDevices = () => {
  const navigate = useNavigate();

  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- GÜNCELLEME PENCERESİ İÇİN STATE ---
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    serialNumber: '',
    city: '',
    district: '',
    neighborhood: '',
    street: '',
    buildingNo: '',
    latitude: '',
    longitude: ''
  });

  // --- SİLME İŞLEMLERİ ---
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [gatewayToDelete, setGatewayToDelete] = useState(null);

  const getBatteryColor = (level) => {
    if (level > 50) return "success";
    if (level > 20) return "warning";
    return "error";
  };

  const formatLastSeen = (dateString) => {
    if (!dateString) return 'Bilinmiyor';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
  };

  const fetchGateways = async () => {
    try {
      const data = await getUserGateways();
      setGateways(data);
    } catch (err) {
      console.error("Cihazlar yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  // --- GÜNCELLEME İŞLEMLERİ ---

  const handleOpenUpdate = (gateway) => {
    setSelectedGateway(gateway);
    // Mevcut verileri forma aktar (Backend verisi yoksa boş string koy)
    setUpdateForm({
      name: gateway.name || '',
      serialNumber: gateway.serialNumber || gateway._id, // Değiştirilemez alan
      city: gateway.address?.city || '',
      district: gateway.address?.district || '',
      neighborhood: gateway.address?.neighborhood || '',
      street: gateway.address?.street || '',
      buildingNo: gateway.address?.buildingNo || '',
      latitude: gateway.location?.lat || '',
      longitude: gateway.location?.lng || ''
    });
    setOpenDialog(true);
  };

  const handleCloseUpdate = () => {
    setOpenDialog(false);
    setSelectedGateway(null);
  };

  const handleFormChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  // Simüle edilmiş "Adresten Koordinat Bulma"
  const handleGeocode = () => {
    if (!updateForm.city) {
      alert("Lütfen en azından bir İl giriniz.");
      return;
    }
    // Rastgele koordinat üret (Simülasyon)
    const mockLat = (41.0000 + Math.random() * 0.1).toFixed(6);
    const mockLng = (28.9000 + Math.random() * 0.1).toFixed(6);

    setUpdateForm(prev => ({
      ...prev,
      latitude: mockLat,
      longitude: mockLng
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: updateForm.name,
        address: {
          city: updateForm.city,
          district: updateForm.district,
          neighborhood: updateForm.neighborhood,
          street: updateForm.street,
          buildingNo: updateForm.buildingNo
        }
        // Backend'de adres değişince koordinat otomatik güncelleniyor
      };

      // API'ye güncelleme isteği at (Eğer api/gatewayService.jsx içinde updateGateway varsa)
      if (selectedGateway?._id) {
        await updateGateway(selectedGateway._id, payload);
      }

      // Listeyi güncelle (Frontend'de anlık değişim için)
      setGateways(prev => prev.map(g =>
        g._id === selectedGateway._id
          ? { ...g, ...payload, location: { lat: updateForm.latitude, lng: updateForm.longitude } }
          : g
      ));

      handleCloseUpdate();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Güncelleme yapılamadı.");
    }
  };

  // Delete handlers
  const handleOpenDelete = (gateway) => {
    setGatewayToDelete(gateway);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setGatewayToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!gatewayToDelete?._id) return;
    try {
      await deleteGateway(gatewayToDelete._id);
      setGateways(prev => prev.filter(g => g._id !== gatewayToDelete._id));
      handleCloseDelete();
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Cihaz silinemedi. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Başlık Bölümü */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Cihazlarım
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400, lineHeight: 1.6 }}>
            Afet durumuna hazırlık için cihazlarınızın durumunu buradan takip edebilirsiniz.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/panel/cihazlarim/ekle')}
          sx={{
            px: 3.5,
            py: 1.25,
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: 3,
            minWidth: { xs: '100%', sm: 170 }
          }}
        >
          Cihaz Ekle
        </Button>
      </Box>

      {/* Grid Bölümü */}
      <Grid container spacing={4}>
        {gateways.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
              <Typography color="text.secondary">Henüz kayıtlı bir cihazınız yok.</Typography>
            </Paper>
          </Grid>
        ) : (
          gateways.map((device) => (
            <Grid item xs={12} md={6} key={device._id || device.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: device.status === 'low_battery' ? '2px solid #d32f2f' : '1px solid rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >


                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.light',
                        color: 'primary.main'
                      }}
                    >
                      <RouterIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" fontWeight="800" sx={{ mb: 0.75, fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
                        {device.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        Son görülme: {formatLastSeen(device.last_seen)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                        {/* Adres gösterimi */}
                        {device.address && typeof device.address === 'object'
                          ? `${device.address.street || ''} ${device.address.buildingNo || ''}, ${device.address.district || ''}/${device.address.city || ''}`
                          : device.address || 'Adres yok'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 3, borderWidth: 1 }} />

                  <Grid container spacing={2.5}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          bgcolor: 'background.default',
                          borderRadius: 3,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
                          <BatteryStdIcon color={getBatteryColor(device.battery)} sx={{ fontSize: 24 }} />
                          <Typography variant="subtitle1" fontWeight="700" sx={{ fontSize: '0.9rem' }}>
                            Batarya
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={device.battery || 0}
                          color={getBatteryColor(device.battery)}
                          sx={{ height: 10, borderRadius: 5, mb: 1.5 }}
                        />
                        <Typography variant="h5" sx={{ textAlign: 'right', fontWeight: '800', fontSize: '1.375rem' }}>
                          %{device.battery || 0}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          bgcolor: 'background.default',
                          borderRadius: 3,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
                          <SmartphoneIcon color="primary" sx={{ fontSize: 24 }} />
                          <Typography variant="subtitle1" fontWeight="700" sx={{ fontSize: '0.9rem' }}>
                            Bağlı Cihaz
                          </Typography>
                        </Stack>
                        <Typography variant="h3" fontWeight="800" color="primary.main" sx={{ mb: 0.75, fontSize: '2.25rem' }}>
                          {device.connected_devices || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          Telefon mesh ağına bağlı
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <SignalCellularAltIcon
                            color={device.signal_quality === 'strong' ? 'success' : 'warning'}
                            sx={{ fontSize: 28 }}
                          />
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                              Mesh Bağlantı Kalitesi
                            </Typography>
                            <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.125rem' }}>
                              {device.signal_quality === 'strong' ? 'Mükemmel' : device.signal_quality === 'medium' ? 'Orta' : 'Zayıf'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditLocationIcon />}
                      fullWidth
                      size="large"
                      onClick={() => handleOpenUpdate(device)} // Butona işlev eklendi
                      sx={{
                        py: 1.25,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        borderRadius: 3
                      }}
                    >
                      Bilgileri Güncelle
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      color="error"
                      fullWidth
                      size="large"
                      onClick={() => handleOpenDelete(device)}
                      sx={{
                        py: 1.25,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        borderStyle: 'dashed'
                      }}
                    >
                      Cihazı Sil
                    </Button>

                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* --- GÜNCELLEME DIALOG PENCERESİ (SMALL PAGE) --- */}
      <Dialog
        open={openDialog}
        onClose={handleCloseUpdate}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          Cihaz Bilgilerini Güncelle
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>

            {/* Seri Numarası (Kilitli) */}
            <TextField
              label="Seri Numarası"
              value={updateForm.serialNumber}
              fullWidth
              InputProps={{
                readOnly: true,
                startAdornment: <InputAdornment position="start"><QrCodeIcon color="disabled" /></InputAdornment>,
                sx: { bgcolor: '#f5f5f5' }
              }}
              helperText="Seri numarası güvenlik nedeniyle değiştirilemez."
            />

            {/* Cihaz İsmi */}
            <TextField
              label="Cihaz İsmi"
              name="name"
              value={updateForm.name}
              onChange={handleFormChange}
              fullWidth
              placeholder="Örn: Ev Girişi"
            />

            <Divider><Chip label="Adres Bilgileri" size="small" /></Divider>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="İl" name="city" value={updateForm.city} onChange={handleFormChange} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="İlçe" name="district" value={updateForm.district} onChange={handleFormChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Mahalle" name="neighborhood" value={updateForm.neighborhood} onChange={handleFormChange} fullWidth />
              </Grid>
              <Grid item xs={8}>
                <TextField label="Sokak/Cadde" name="street" value={updateForm.street} onChange={handleFormChange} fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Bina No" name="buildingNo" value={updateForm.buildingNo} onChange={handleFormChange} fullWidth />
              </Grid>
            </Grid>

            {/* Koordinat Bul Butonu */}
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleGeocode}
              sx={{ borderStyle: 'dashed' }}
            >
              Adres Koordinatlarını Bul
            </Button>

            {/* Koordinatlar (Simüle Edilmiş) */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Enlem (Latitude)"
                  value={updateForm.latitude}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start"><MapIcon fontSize="small" /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Boylam (Longitude)"
                  value={updateForm.longitude}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start"><MapIcon fontSize="small" /></InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseUpdate} color="inherit" size="large">İptal</Button>
          <Button onClick={handleSave} variant="contained" size="large">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* --- SİLME ONAY DIALOGU --- */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
          Cihazı Sil
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            "{gatewayToDelete?.name || 'Bu cihaz'}" adlı cihazı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDelete} color="inherit" size="large">İptal</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" size="large">Sil</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CitizenDevices;
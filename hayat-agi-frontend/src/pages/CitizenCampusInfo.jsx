import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

const BLOOD_GROUPS = [
  'A Rh(+)', 'A Rh(-)',
  'B Rh(+)', 'B Rh(-)',
  'AB Rh(+)', 'AB Rh(-)',
  '0 Rh(+)', '0 Rh(-)'
];

// TODO: Bu cihaz listesi şu an için örnek veridir.
// Gerçek uygulamada backend'den kullanıcının cihazları çekilecektir.
const myGateways = [
  {
    id: 1,
    name: 'Ev (Salon)',
    status: 'active',
    battery: 92,
    signal: 'strong',
    connectedPhones: 4,
    lastSeen: 'Az önce',
    address: 'Çankaya Mah. 102. Sokak No:5'
  },
  {
    id: 2,
    name: 'İş Yeri (Ofis)',
    status: 'low_battery',
    battery: 15,
    signal: 'medium',
    connectedPhones: 12,
    lastSeen: '10 dakika önce',
    address: 'Teknokent B Blok Kat:2'
  }
];

const CitizenCampusInfo = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);

  // Her cihaz için ayrı kişi / evcil hayvan listesi tut
  const [peopleByDevice, setPeopleByDevice] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [petsByDevice, setPetsByDevice] = useState({});
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editingPetId, setEditingPetId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthDate: '',
    bloodGroup: '',
    conditions: ''
  });
  const [petForm, setPetForm] = useState({
    name: '',
    animalType: '',
    breed: ''
  });
  const [touched, setTouched] = useState({});

  const selectedDeviceId = selectedDevice?.id;
  const people = selectedDeviceId ? peopleByDevice[selectedDeviceId] || [] : [];
  const pets = selectedDeviceId ? petsByDevice[selectedDeviceId] || [] : [];

  const handleOpenDeviceDialog = () => {
    setIsDeviceDialogOpen(true);
  };

  const handleCloseDeviceDialog = () => {
    setIsDeviceDialogOpen(false);
  };

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setIsDeviceDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setEditingPersonId(null);
    setForm({
      name: '',
      gender: '',
      birthDate: '',
      bloodGroup: '',
      conditions: ''
    });
    setTouched({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPersonId(null);
    setForm({
      name: '',
      gender: '',
      birthDate: '',
      bloodGroup: '',
      conditions: ''
    });
    setTouched({});
  };

  const handleOpenPetDialog = () => {
    setEditingPetId(null);
    setPetForm({
      name: '',
      animalType: '',
      breed: ''
    });
    setIsPetDialogOpen(true);
  };

  const handleClosePetDialog = () => {
    setIsPetDialogOpen(false);
    setEditingPetId(null);
    setPetForm({
      name: '',
      animalType: '',
      breed: ''
    });
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isRequiredError = (field) =>
    touched[field] && !form[field];

  const isFormValid =
    form.name &&
    form.gender &&
    form.birthDate &&
    form.bloodGroup;

  const isPetFormValid =
    petForm.name &&
    petForm.animalType &&
    petForm.breed;

  const handleSavePerson = () => {
    if (!isFormValid) {
      setTouched({
        name: true,
        gender: true,
        birthDate: true,
        bloodGroup: true
      });
      return;
    }

    if (!selectedDeviceId) {
      return;
    }

    setPeopleByDevice((prev) => {
      const currentList = prev[selectedDeviceId] || [];

      let nextList;
      if (editingPersonId) {
        nextList = currentList.map((p) =>
          p.id === editingPersonId
            ? { ...p, ...form }
            : p
        );
      } else {
        nextList = [
          ...currentList,
          {
            id: Date.now(),
            ...form
          }
        ];
      }

      return {
        ...prev,
        [selectedDeviceId]: nextList
      };
    });

    handleCloseDialog();
  };

  const handleChangePet = (field) => (event) => {
    setPetForm((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSavePet = () => {
    if (!isPetFormValid) {
      return;
    }

    if (!selectedDeviceId) {
      return;
    }

    setPetsByDevice((prev) => {
      const currentList = prev[selectedDeviceId] || [];

      let nextList;
      if (editingPetId) {
        nextList = currentList.map((pet) =>
          pet.id === editingPetId
            ? { ...pet, ...petForm }
            : pet
        );
      } else {
        nextList = [
          ...currentList,
          {
            id: Date.now(),
            ...petForm
          }
        ];
      }

      return {
        ...prev,
        [selectedDeviceId]: nextList
      };
    });

    handleClosePetDialog();
  };

  return (
    <Box>
      {/* Yerleşke Bilgileri Üst Bölüm + Cihaz Seçimi */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Yerleşke Bilgileri
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {selectedDevice && (
            <Chip
              label={`Seçili Cihaz: ${selectedDevice.name}`}
              color="primary"
              variant="outlined"
            />
          )}
          <Button variant="outlined" onClick={handleOpenDeviceDialog}>
            Cihaz Seç
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.06)',
          background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Yerleşke Özeti
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Yerleşkeniz ile ilgili temel bilgiler bu alanda görüntülenecektir. Adres,
          kat sayısı, toplam daire/oda bilgisi gibi veriler burada özetlenebilir.
          (Bu alan şu anda örnek amaçlı yer tutucu metin içermektedir.)
        </Typography>

        {/* Seçilen Cihaz Önizlemesi */}
        <Box sx={{ mt: 3 }}>
          {selectedDevice ? (
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                p: 1.5
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      borderRadius: 2
                    }}
                  >
                    <RouterIcon />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedDevice.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDevice.address}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Son görülme: {selectedDevice.lastSeen}
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BatteryStdIcon color={selectedDevice.battery > 50 ? 'success' : selectedDevice.battery > 20 ? 'warning' : 'error'} />
                      <Typography variant="body2">
                        Batarya: <strong>%{selectedDevice.battery}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SmartphoneIcon color="primary" />
                      <Typography variant="body2">
                        Bağlı Cihaz: <strong>{selectedDevice.connectedPhones}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SignalCellularAltIcon color={selectedDevice.signal === 'strong' ? 'success' : 'warning'} />
                      <Typography variant="body2">
                        Mesh: <strong>{selectedDevice.signal === 'strong' ? 'Mükemmel' : 'Orta Seviye'}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Henüz bir cihaz seçilmedi. Lütfen üst kısımdan "Cihaz Seç" butonuna tıklayarak bu yerleşke için kullanmak istediğiniz gateway cihazını belirleyin.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Kişiler Bölümü */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Kişiler
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          disabled={!selectedDevice}
        >
          Kişi Ekle
        </Button>
      </Box>

      {people.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px dashed rgba(0,0,0,0.15)',
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {selectedDevice
              ? 'Henüz bu cihaza kayıtlı bir kişi bulunmuyor.'
              : 'Kişi ekleyebilmek için önce bir cihaz seçmelisiniz.'}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleOpenDialog}
            disabled={!selectedDevice}
          >
            Kişi Ekle
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {people.map((person) => (
            <Grid item xs={12} md={6} key={person.id}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {person.name}
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => {
                        setEditingPersonId(person.id);
                        setForm({
                          name: person.name,
                          gender: person.gender,
                          birthDate: person.birthDate,
                          bloodGroup: person.bloodGroup,
                          conditions: person.conditions || ''
                        });
                        setTouched({});
                        setIsDialogOpen(true);
                      }}
                    >
                      Düzenle
                    </Button>
                  </Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                    <Chip label={person.gender === 'male' ? 'Erkek' : 'Kadın'} size="small" />
                    <Chip label={person.bloodGroup} size="small" color="primary" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Doğum Tarihi: {person.birthDate}
                  </Typography>
                  {person.conditions && (
                    <Typography variant="body2" color="text.secondary">
                      Rahatsızlıklar: {person.conditions}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Evcil Hayvanlar Bölümü */}
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Evcil Hayvanlar
          </Typography>
          <Button
            variant="outlined"
            onClick={handleOpenPetDialog}
            disabled={!selectedDevice}
          >
            Evcil Hayvan Ekle
          </Button>
        </Box>

        {pets.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px dashed rgba(0,0,0,0.15)',
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              {selectedDevice
                ? 'Henüz bu cihaza kayıtlı bir evcil hayvan bulunmuyor.'
                : 'Evcil hayvan ekleyebilmek için önce bir cihaz seçmelisiniz.'}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleOpenPetDialog}
              disabled={!selectedDevice}
            >
              Evcil Hayvan Ekle
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {pets.map((pet) => (
              <Grid item xs={12} md={6} key={pet.id}>
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {pet.name}
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => {
                          setEditingPetId(pet.id);
                          setPetForm({
                            name: pet.name,
                            animalType: pet.animalType,
                            breed: pet.breed
                          });
                          setIsPetDialogOpen(true);
                        }}
                      >
                        Düzenle
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Hayvan Türü: {pet.animalType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cinsi: {pet.breed}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Kişi Ekleme Diyaloğu */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{editingPersonId ? 'Kişiyi Düzenle' : 'Kişi Ekle'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1, maxWidth: 600 }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="İsim"
                value={form.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                error={isRequiredError('name')}
                helperText={isRequiredError('name') ? 'İsim zorunlu bir alandır.' : ''}
              />

              <FormControl component="fieldset" error={isRequiredError('gender')} fullWidth>
                <FormLabel component="legend">Cinsiyet</FormLabel>
                <RadioGroup
                  row
                  value={form.gender}
                  onChange={handleChange('gender')}
                  onBlur={handleBlur('gender')}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Erkek" />
                  <FormControlLabel value="female" control={<Radio />} label="Kadın" />
                </RadioGroup>
                {isRequiredError('gender') && (
                  <Typography variant="caption" color="error">
                    Cinsiyet zorunlu bir alandır.
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Doğum Tarihi"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.birthDate}
                onChange={handleChange('birthDate')}
                onBlur={handleBlur('birthDate')}
                error={isRequiredError('birthDate')}
                helperText={isRequiredError('birthDate') ? 'Doğum tarihi zorunlu bir alandır.' : ''}
              />

              <TextField
                select
                fullWidth
                label="Kan Grubu"
                value={form.bloodGroup}
                onChange={handleChange('bloodGroup')}
                onBlur={handleBlur('bloodGroup')}
                error={isRequiredError('bloodGroup')}
                helperText={isRequiredError('bloodGroup') ? 'Kan grubu zorunlu bir alandır.' : ''}
              >
                {BLOOD_GROUPS.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Rahatsızlıklar"
                multiline
                minRows={3}
                value={form.conditions}
                onChange={handleChange('conditions')}
                placeholder="Kronik hastalıklar, alerjiler vb. bilgileri giriniz."
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePerson}
            sx={{ ml: 1 }}
          >
            Kişiyi Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Evcil Hayvan Ekleme Diyaloğu */}
      <Dialog
        open={isPetDialogOpen}
        onClose={handleClosePetDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingPetId ? 'Evcil Hayvanı Düzenle' : 'Evcil Hayvan Ekle'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="İsim"
                  value={petForm.name}
                  onChange={handleChangePet('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Hangi Hayvan"
                  value={petForm.animalType}
                  onChange={handleChangePet('animalType')}
                  placeholder="Örn. Kedi, Köpek vb."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cinsi"
                  value={petForm.breed}
                  onChange={handleChangePet('breed')}
                  placeholder="Örn. Golden Retriever, Van Kedisi vb."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClosePetDialog} color="inherit">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePet}
            sx={{ ml: 1 }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cihaz Seçim Diyaloğu */}
      <Dialog
        open={isDeviceDialogOpen}
        onClose={handleCloseDeviceDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Cihaz Seç</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {myGateways.map((device) => (
              <Grid item xs={12} md={6} key={device.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => handleSelectDevice(device)}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                          borderRadius: 2
                        }}
                      >
                        <RouterIcon />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {device.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {device.address}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Son görülme: {device.lastSeen}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Chip
                        label={device.status === 'active' ? 'Aktif & Hazır' : 'Pil Düşük!'}
                        color={device.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                      <Chip
                        label={`Bağlı: ${device.connectedPhones}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeviceDialog} color="inherit">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CitizenCampusInfo;



import React, { useState, useEffect } from 'react';
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
  Divider,
  Avatar,
  IconButton,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PetsIcon from '@mui/icons-material/Pets';
import EditIcon from '@mui/icons-material/Edit';


import { getSystemOptions } from '../services/metadataService';

const CitizenCampusInfo = () => {

  const [options, setOptions] = useState({
    bloodGroups: [],
    genderLabels: {}
  });

  const [loadingOptions, setLoadingOptions] = useState(true);

  const [people, setPeople] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editingPetId, setEditingPetId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthDate: null,
    bloodGroup: '',
    conditions: ''
  });
  const [petForm, setPetForm] = useState({
    name: '',
    animalType: '',
    breed: ''
  });
  const [touched, setTouched] = useState({});

  // 3. ADIM: Sayfa Açılınca Backend'den Seçenekleri Çek
  useEffect(() => {
    const fetchVeri = async () => {
      try {
        const data = await getSystemOptions();
        console.log("Backend Verisi Geldi:", data); // Kontrol için

        setOptions({
          bloodGroups: data.healthOptions?.bloodGroups || [],
          genderLabels: data.genderLabels || {}
        });
      } catch (e) {
        console.error("Seçenekler yüklenirken hata:", e);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchVeri();
  }, []);

  const handleOpenDialog = () => {
    setEditingPersonId(null);
    setForm({
      name: '',
      gender: '',
      birthDate: null,
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
      birthDate: null,
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

  const handleDateChange = (newValue) => {
    setForm((prev) => ({
      ...prev,
      birthDate: newValue
    }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isRequiredError = (field) => {
    if (field === 'birthDate') {
      return touched[field] && !form[field];
    }
    return touched[field] && !form[field];
  };

  const isFormValid =
    form.name &&
    form.gender &&
    form.birthDate &&
    form.bloodGroup;

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

    const personData = {
      ...form,
      birthDate: form.birthDate ? form.birthDate.format('DD/MM/YYYY') : ''
    };

    if (editingPersonId) {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === editingPersonId
            ? { ...p, ...personData }
            : p
        )
      );
    } else {
      setPeople((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...personData
        }
      ]);
    }

    handleCloseDialog();
  };

  const isPetFormValid =
    petForm.name &&
    petForm.animalType &&
    petForm.breed;

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

    if (editingPetId) {
      setPets((prev) =>
        prev.map((pet) =>
          pet.id === editingPetId
            ? { ...pet, ...petForm }
            : pet
        )
      );
    } else {
      setPets((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...petForm
        }
      ]);
    }

    handleClosePetDialog();
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Başlık Bölümü */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Yerleşke Bilgileri
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 400, lineHeight: 1.6 }}>
          Yerleşkenizdeki kişiler ve evcil hayvanlar hakkında bilgiler
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)'
        }}
      >
        <Typography variant="h5" fontWeight="700" sx={{ mb: 1.5, fontSize: { xs: '1.125rem', md: '1.375rem' } }}>
          Yerleşke Özeti
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
          Yerleşkeniz ile ilgili temel bilgiler bu alanda görüntülenecektir. Adres,
          kat sayısı, toplam daire/oda bilgisi gibi veriler burada özetlenebilir.
        </Typography>
      </Paper>

      {/* Kişiler Bölümü */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="700" sx={{ fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
          Kişiler
        </Typography>
        {people.length > 0 && (
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
            sx={{
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 3
            }}
          >
            Kişi Ekle
          </Button>
        )}
      </Box>

      {people.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            border: '2px dashed rgba(0,0,0,0.15)',
            textAlign: 'center',
            color: 'text.secondary',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <PersonAddIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1rem', fontWeight: 600 }}>
            Henüz kayıtlı bir kişi bulunmuyor.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
            sx={{
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 3
            }}
          >
            İlk Kişiyi Ekle
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {people.map((person) => (
            <Grid item xs={12} md={6} key={person.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.light' }}>
                        <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ fontSize: '1.125rem' }}>
                          {person.name.charAt(0).toUpperCase()}
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="800" sx={{ mb: 0.5, fontSize: { xs: '1.125rem', md: '1.375rem' } }}>
                          {person.name}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.75 }}>
                          <Chip
                            // DÜZELTME: Kartta Backend'den gelen etiketi (Örn: Erkek) göster
                            label={options.genderLabels[person.gender] || person.gender}
                            size="small"
                            sx={{ fontSize: '0.8rem', fontWeight: 600, height: 26 }}
                          />
                          <Chip
                            label={person.bloodGroup}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.8rem', fontWeight: 600, height: 26 }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                    <IconButton
                      onClick={() => {
                        setEditingPersonId(person.id);
                        setForm({
                          name: person.name,
                          gender: person.gender,
                          birthDate: person.birthDate ? dayjs(person.birthDate, 'DD/MM/YYYY') : null,
                          bloodGroup: person.bloodGroup,
                          conditions: person.conditions || ''
                        });
                        setTouched({});
                        setIsDialogOpen(true);
                      }}
                      sx={{
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2.5, borderWidth: 1 }} />
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                        Doğum Tarihi
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                        {person.birthDate}
                      </Typography>
                    </Box>
                    {person.conditions && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                          Rahatsızlıklar
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                          {person.conditions}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Evcil Hayvanlar Bölümü */}
      <Box sx={{ mt: 5 }}>
        <Divider sx={{ mb: 3, borderWidth: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight="700" sx={{ fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
            Evcil Hayvanlar
          </Typography>
          {pets.length > 0 && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<PetsIcon />}
              onClick={handleOpenPetDialog}
              sx={{
                px: 3.5,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 3
              }}
            >
              Evcil Hayvan Ekle
            </Button>
          )}
        </Box>

        {pets.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 3,
              border: '2px dashed rgba(0,0,0,0.15)',
              textAlign: 'center',
              color: 'text.secondary',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <PetsIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1rem', fontWeight: 600 }}>
              Henüz kayıtlı bir evcil hayvan bulunmuyor.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PetsIcon />}
              onClick={handleOpenPetDialog}
              sx={{
                px: 3.5,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 3
              }}
            >
              İlk Evcil Hayvanı Ekle
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {pets.map((pet) => (
              <Grid item xs={12} md={6} key={pet.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.light' }}>
                          <PetsIcon sx={{ color: 'secondary.main', fontSize: 24 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight="800" sx={{ mb: 0.5, fontSize: { xs: '1.125rem', md: '1.375rem' } }}>
                            {pet.name}
                          </Typography>
                        </Box>
                      </Stack>
                      <IconButton
                        onClick={() => {
                          setEditingPetId(pet.id);
                          setPetForm({
                            name: pet.name,
                            animalType: pet.animalType,
                            breed: pet.breed
                          });
                          setIsPetDialogOpen(true);
                        }}
                        sx={{
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2.5, borderWidth: 1 }} />
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                          Hayvan Türü
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                          {pet.animalType}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                          Cinsi
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                          {pet.breed}
                        </Typography>
                      </Box>
                    </Stack>
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
        PaperProps={{
          sx: {
            borderRadius: 4
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.375rem', fontWeight: 700, pb: 1.5 }}>
          {editingPersonId ? 'Kişiyi Düzenle' : 'Kişi Ekle'}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2.5 }}>
          {/* Yükleniyor Kontrolü */}
          {loadingOptions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ maxWidth: 700 }}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="İsim"
                  value={form.name}
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={isRequiredError('name')}
                  helperText={isRequiredError('name') ? 'İsim zorunlu bir alandır.' : ''}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '1rem'
                    }
                  }}
                />

                {/* 4. ADIM: CİNSİYET (Dinamik Backend Entegrasyonu) */}
                <FormControl component="fieldset" error={isRequiredError('gender')} fullWidth>
                  <FormLabel component="legend" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1.5 }}>
                    Cinsiyet
                  </FormLabel>
                  <RadioGroup
                    row
                    value={form.gender}
                    onChange={handleChange('gender')}
                    onBlur={handleBlur('gender')}
                  >
                    {/* Backend'den gelen etiketleri basıyoruz */}
                    {Object.entries(options.genderLabels).length > 0 ? (
                      Object.entries(options.genderLabels).map(([key, label]) => (
                        <FormControlLabel
                          key={key}
                          value={key}
                          control={<Radio />}
                          label={<Typography sx={{ fontSize: '1rem' }}>{label}</Typography>}
                        />
                      ))
                    ) : (
                      // Yüklenmezse yedek (Fallback)
                      <>
                        <FormControlLabel value="female" control={<Radio />} label="Kadın" />
                        <FormControlLabel value="male" control={<Radio />} label="Erkek" />
                      </>
                    )}
                  </RadioGroup>
                  {isRequiredError('gender') && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                      Cinsiyet zorunlu bir alandır.
                    </Typography>
                  )}
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                  <DatePicker
                    label="Doğum Tarihi"
                    value={form.birthDate}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: isRequiredError('birthDate'),
                        helperText: isRequiredError('birthDate') ? 'Doğum tarihi zorunlu bir alandır.' : '',
                        onBlur: handleBlur('birthDate')
                      }
                    }}
                    maxDate={dayjs()}
                    format="DD/MM/YYYY"
                  />
                </LocalizationProvider>

                {/* 5. ADIM: KAN GRUBU (Dinamik Backend Entegrasyonu) */}
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
                  {/* Backend'den gelen listeyi basıyoruz */}
                  {options.bloodGroups.map((group) => (
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
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            size="large"
            sx={{
              px: 2.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePerson}
            size="large"
            sx={{
              ml: 1,
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 2
            }}
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
        PaperProps={{
          sx: {
            borderRadius: 4
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.375rem', fontWeight: 700, pb: 1.5 }}>
          {editingPetId ? 'Evcil Hayvanı Düzenle' : 'Evcil Hayvan Ekle'}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2.5 }}>
          <Box>
            <Grid container spacing={2.5}>
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
          <Button
            onClick={handleClosePetDialog}
            color="inherit"
            size="large"
            sx={{
              px: 2.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePet}
            size="large"
            sx={{
              ml: 1,
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 2
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CitizenCampusInfo;
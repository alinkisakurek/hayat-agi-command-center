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
  Autocomplete,
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
    genderLabels: {},
    chronicConditions: [],
    medications: [],
    prostheses: []
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
    conditions: '',
    medications: '',
    prosthetics: ''
  });


  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [selectedProsthetics, setSelectedProsthetics] = useState([]);

  const [petForm, setPetForm] = useState({
    name: '',
    animalType: '',
    breed: ''
  });
  const [touched, setTouched] = useState({});


  useEffect(() => {
    const fetchVeri = async () => {
      try {
        const data = await getSystemOptions();
        setOptions({
          bloodGroups: data.healthOptions?.bloodGroups || [],
          genderLabels: data.genderLabels || {},
          chronicConditions: data.healthOptions?.chronicConditions || [],
          medications: data.healthOptions?.medications || [],
          prostheses: data.healthOptions?.prostheses || []
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
      conditions: '',
      medications: '',
      prosthetics: ''
    });
    setTouched({});
    setSelectedDiseases([]);
    setSelectedMedications([]);
    setSelectedProsthetics([]);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPersonId(null);

    setForm({ name: '', gender: '', birthDate: null, bloodGroup: '', conditions: '', medications: '', prosthetics: '' });
    setSelectedDiseases([]);
    setSelectedMedications([]);
    setSelectedProsthetics([]);
    setTouched({});
  };

  const handleOpenPetDialog = () => {
    setEditingPetId(null);
    setPetForm({ name: '', animalType: '', breed: '' });
    setIsPetDialogOpen(true);
  };

  const handleClosePetDialog = () => {
    setIsPetDialogOpen(false);
    setEditingPetId(null);
    setPetForm({ name: '', animalType: '', breed: '' });
  };



  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleDateChange = (newValue) => {
    setForm((prev) => ({ ...prev, birthDate: newValue }));
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

  const isFormValid = form.name && form.gender && form.birthDate && form.bloodGroup;

  const handleSavePerson = () => {
    if (!isFormValid) {
      setTouched({ name: true, gender: true, birthDate: true, bloodGroup: true });
      return;
    }


    const conditionsString = selectedDiseases.join(', ');
    const medicationsString = selectedMedications.join(', ');
    const prostheticsString = selectedProsthetics.join(', ');

    const personData = {
      ...form,
      conditions: conditionsString,
      medications: medicationsString,
      prosthetics: prostheticsString,
      birthDate: form.birthDate ? form.birthDate.format('DD/MM/YYYY') : ''
    };

    if (editingPersonId) {
      setPeople((prev) => prev.map((p) => p.id === editingPersonId ? { ...p, ...personData } : p));
    } else {
      setPeople((prev) => [...prev, { id: Date.now(), ...personData }]);
    }

    handleCloseDialog();
  };


  const isPetFormValid = petForm.name && petForm.animalType && petForm.breed;

  const handleChangePet = (field) => (event) => {
    setPetForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSavePet = () => {
    if (!isPetFormValid) return;

    if (editingPetId) {
      setPets((prev) => prev.map((pet) => pet.id === editingPetId ? { ...pet, ...petForm } : pet));
    } else {
      setPets((prev) => [...prev, { id: Date.now(), ...petForm }]);
    }
    handleClosePetDialog();
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>


      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Yerleşke Bilgileri
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Yerleşkenizdeki kişiler ve evcil hayvanlar hakkında bilgiler
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)' }}>
        <Typography variant="h5" fontWeight="700" sx={{ mb: 1.5 }}>Yerleşke Özeti</Typography>
        <Typography variant="body1" color="text.secondary">
          Yerleşkeniz ile ilgili temel bilgiler bu alanda görüntülenecektir.
        </Typography>
      </Paper>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700">Kişiler</Typography>
        {people.length > 0 && (
          <Button variant="contained" size="large" startIcon={<PersonAddIcon />} onClick={handleOpenDialog} sx={{ borderRadius: 3 }}>
            Kişi Ekle
          </Button>
        )}
      </Box>

      {people.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: '2px dashed rgba(0,0,0,0.15)', textAlign: 'center' }}>
          <PersonAddIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5, opacity: 0.5 }} />
          <Typography variant="h6">Henüz kayıtlı bir kişi bulunmuyor.</Typography>
          <Button variant="contained" size="large" startIcon={<PersonAddIcon />} onClick={handleOpenDialog} sx={{ mt: 2, borderRadius: 3 }}>
            İlk Kişiyi Ekle
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {people.map((person) => (
            <Grid item xs={12} md={6} key={person.id}>
              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.light' }}>
                        <Typography variant="h6" fontWeight="800" color="primary.main">
                          {person.name.charAt(0).toUpperCase()}
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="800">{person.name}</Typography>
                        <Stack direction="row" spacing={1} mt={0.5}>
                          {/* BACKEND VERİSİ GÖSTERİMİ */}
                          <Chip label={options.genderLabels[person.gender] || person.gender} size="small" />
                          <Chip label={person.bloodGroup} size="small" color="primary" variant="outlined" />
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
                          conditions: person.conditions || '',
                          medications: person.medications || '',
                          prosthetics: person.prosthetics || ''
                        });


                        setSelectedDiseases(person.conditions ? person.conditions.split(', ').filter(Boolean) : []);
                        setSelectedMedications(person.medications ? person.medications.split(', ').filter(Boolean) : []);
                        setSelectedProsthetics(person.prosthetics ? person.prosthetics.split(', ').filter(Boolean) : []);

                        setTouched({});
                        setIsDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">Doğum Tarihi: {person.birthDate}</Typography>
                    {person.conditions && (
                      <Box>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">Rahatsızlıklar</Typography>
                        <Typography variant="body2">{person.conditions}</Typography>
                      </Box>
                    )}
                    {person.medications && (
                      <Box>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">İlaçlar</Typography>
                        <Typography variant="body2">{person.medications}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}


      <Box sx={{ mt: 5 }}>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="700">Evcil Hayvanlar</Typography>
          {pets.length > 0 && (
            <Button variant="outlined" startIcon={<PetsIcon />} onClick={handleOpenPetDialog} sx={{ borderRadius: 3 }}>
              Evcil Hayvan Ekle
            </Button>
          )}
        </Box>
        {pets.length === 0 ? (
          <Paper sx={{ p: 5, border: '2px dashed rgba(0,0,0,0.15)', textAlign: 'center', borderRadius: 3 }}>
            <PetsIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="h6" mt={2}>Henüz kayıtlı hayvan yok.</Typography>
            <Button variant="outlined" startIcon={<PetsIcon />} onClick={handleOpenPetDialog} sx={{ mt: 2, borderRadius: 3 }}>
              İlk Evcil Hayvanı Ekle
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {pets.map(pet => (
              <Grid item xs={12} md={6} key={pet.id}>
                <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6">{pet.name}</Typography>
                      <Typography variant="body2">{pet.animalType} - {pet.breed}</Typography>
                    </Box>
                    <IconButton onClick={() => { setEditingPetId(pet.id); setPetForm(pet); setIsPetDialogOpen(true); }}>
                      <EditIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>


      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingPersonId ? 'Kişiyi Düzenle' : 'Kişi Ekle'}</DialogTitle>
        <DialogContent dividers>
          {loadingOptions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
          ) : (
            <Stack spacing={2.5} mt={1}>
              <TextField
                fullWidth label="İsim" value={form.name} onChange={handleChange('name')}
                error={isRequiredError('name')} helperText={isRequiredError('name') && 'Zorunlu alan'} onBlur={handleBlur('name')}
              />

              {/* CİNSİYET (Backend) */}
              <FormControl component="fieldset" error={isRequiredError('gender')}>
                <FormLabel component="legend">Cinsiyet</FormLabel>
                <RadioGroup row value={form.gender} onChange={handleChange('gender')} onBlur={handleBlur('gender')}>
                  {Object.entries(options.genderLabels).map(([key, label]) => (
                    <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
                  ))}
                </RadioGroup>
                {isRequiredError('gender') && <Typography color="error" variant="caption">Seçim zorunlu</Typography>}
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                <DatePicker
                  label="Doğum Tarihi" value={form.birthDate} onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, error: isRequiredError('birthDate') } }} format="DD/MM/YYYY"
                />
              </LocalizationProvider>


              <TextField select fullWidth label="Kan Grubu" value={form.bloodGroup} onChange={handleChange('bloodGroup')}
                error={isRequiredError('bloodGroup')} onBlur={handleBlur('bloodGroup')}>
                {options.bloodGroups.map((group) => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </TextField>


              <Autocomplete
                multiple
                options={options.chronicConditions} // Backend listesi
                freeSolo // Listede yoksa elle yazabilsin
                value={selectedDiseases}
                onChange={(_, newValue) => setSelectedDiseases(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Rahatsızlıklar" placeholder="Seçiniz veya yazınız" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
              />


              <Autocomplete
                multiple
                options={options.medications}
                freeSolo
                value={selectedMedications}
                onChange={(_, newValue) => setSelectedMedications(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Kullandığı İlaçlar" placeholder="Seçiniz veya yazınız" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
              />


              <Autocomplete
                multiple
                options={options.prostheses}
                freeSolo
                value={selectedProsthetics}
                onChange={(_, newValue) => setSelectedProsthetics(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Protez / Cihazlar" placeholder="Seçiniz veya yazınız" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
              />

            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">İptal</Button>
          <Button variant="contained" onClick={handleSavePerson}>Kaydet</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={isPetDialogOpen} onClose={handleClosePetDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingPetId ? 'Düzenle' : 'Ekle'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField fullWidth label="İsim" value={petForm.name} onChange={handleChangePet('name')} />
            <TextField fullWidth label="Tür" value={petForm.animalType} onChange={handleChangePet('animalType')} />
            <TextField fullWidth label="Cins" value={petForm.breed} onChange={handleChangePet('breed')} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClosePetDialog}>İptal</Button>
          <Button variant="contained" onClick={handleSavePet}>Kaydet</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default CitizenCampusInfo;
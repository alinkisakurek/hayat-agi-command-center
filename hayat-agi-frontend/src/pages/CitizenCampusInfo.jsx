import React, { useState, useEffect, useMemo } from 'react';
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
  LinearProgress,
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
import DeleteIcon from '@mui/icons-material/Delete';
import RouterIcon from '@mui/icons-material/Router';
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DevicesIcon from '@mui/icons-material/Devices';
import { getUserGateways, addPersonToGateway, addPetToGateway, removePersonFromGateway, removePetFromGateway } from '../api/gatewayService';
import { getSystemOptions } from '../services/metadataService';

// Options will be derived from backend metadata (healthOptions, genderLabels)



const CitizenCampusInfo = () => {
  const [people, setPeople] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editingPetId, setEditingPetId] = useState(null);
  const [metadata, setMetadata] = useState({
    bloodGroups: [],
    chronicConditions: [],
    medications: [],
    prostheses: [],
    genders: {}
  });
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    tcKimlikNo: '',
    birthDate: null,
    bloodGroup: '',
    conditions: '',
    medications: '',
    prosthetics: ''
  });
  const [petForm, setPetForm] = useState({
    name: '',
    animalType: '',
    breed: '',
    microchipNumber: ''
  });
  const [petTouched, setPetTouched] = useState({});
  const [touched, setTouched] = useState({});
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [selectedProsthetics, setSelectedProsthetics] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // derive option objects from backend metadata (so component uses objects with id,name,category)
  const diseaseOptions = useMemo(() => (metadata.chronicConditions || []).map((name) => ({ id: name, name, category: 'Diğer' })), [metadata.chronicConditions]);
  const medicationOptions = useMemo(() => (metadata.medications || []).map((name) => ({ id: name, name, category: 'Diğer' })), [metadata.medications]);
  const prostheticOptions = useMemo(() => (metadata.prostheses || []).map((name) => ({ id: name, name, category: 'Diğer' })), [metadata.prostheses]);
  const genderEntries = useMemo(() => Object.entries(metadata.genders || {}), [metadata.genders]);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await getSystemOptions();
        // Backend'den gelen veriyi state'e atıyoruz.
        // Backend response shape: { healthOptions: { bloodGroups, chronicConditions, medications, prostheses }, genderLabels }
        if (data) {
          const ho = data.healthOptions || data.HEALTH_OPTIONS || {};
          const gl = data.genderLabels || data.GENDER_LABELS || {};
          setMetadata({
            bloodGroups: ho.bloodGroups || [],
            chronicConditions: ho.chronicConditions || [],
            medications: ho.medications || [],
            prostheses: ho.prostheses || [],
            genders: gl || {}
          });
        }
      } catch (error) {
        console.error('Metadata yüklenemedi:', error);
        // Hata olursa fallback (boş) değerler kalır veya buraya manuel default atayabilirsin
      } finally {
        setLoadingMetadata(false);
      }
    };
    loadMetadata();
  }, []);

  // Cihazları yükle
  useEffect(() => {
    const loadDevices = async () => {
      setLoadingDevices(true);
      try {
        // Only fetch gateways that belong to the logged-in user
        const data = await getUserGateways();
        setDevices(data);
      } catch (error) {
        console.error('Cihazlar yüklenirken hata:', error);
      } finally {
        setLoadingDevices(false);
      }
    };
    loadDevices();
  }, []);

  const getBatteryColor = (level) => {
    if (level > 50) return "success";
    if (level > 20) return "warning";
    return "error";
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Bilinmiyor';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  const handleOpenDeviceDialog = () => {
    setIsDeviceDialogOpen(true);
  };

  const handleCloseDeviceDialog = () => {
    setIsDeviceDialogOpen(false);
  };

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setIsDeviceDialogOpen(false);

    // Populate people & pets from selected device (backend shape -> frontend shape)
    try {
      const deviceId = device._id || device.id;

      const mappedPeople = (device.registered_users || []).map((u) => ({
        id: u._id || u.id || Date.now().toString(),
        name: u.fullname || '',
        tcKimlikNo: u.tcNumber || '',
        gender: u.gender || '',
        birthDate: u.birthDate ? new Date(u.birthDate).toLocaleDateString('tr-TR') : '',
        bloodGroup: u.bloodType || '',
        conditions: Array.isArray(u.medicalConditions) ? u.medicalConditions.join(', ') : (u.medicalConditions || ''),
        medications: Array.isArray(u.medications) ? u.medications.join(', ') : (u.medications || ''),
        prosthetics: Array.isArray(u.prosthetics) ? u.prosthetics.join(', ') : (u.prosthetics || ''),
        deviceId,
        deviceName: device.name || ''
      }));

      const mappedPets = (device.registered_animals || []).map((p) => ({
        id: p._id || p.id || Date.now().toString(),
        name: p.name || '',
        animalType: p.species || '',
        breed: p.breed || '',
        microchipNumber: p.microchipId || '',
        deviceId,
        deviceName: device.name || ''
      }));

      setPeople(mappedPeople);
      setPets(mappedPets);
    } catch (err) {
      console.error('Error mapping device users/pets:', err);
    }
  };

  // Seçili cihaza ait kişileri filtrele
  const filteredPeople = useMemo(() => {
    if (!selectedDevice) return [];
    const deviceId = selectedDevice._id || selectedDevice.id;
    return people.filter(person => {
      const personDeviceId = person.deviceId;
      return personDeviceId === deviceId;
    });
  }, [people, selectedDevice]);

  // Seçili cihaza ait evcil hayvanları filtrele
  const filteredPets = useMemo(() => {
    if (!selectedDevice) return [];
    const deviceId = selectedDevice._id || selectedDevice.id;
    return pets.filter(pet => {
      const petDeviceId = pet.deviceId;
      return petDeviceId === deviceId;
    });
  }, [pets, selectedDevice]);

  const handleOpenDialog = () => {
    setEditingPersonId(null);
    setForm({
      name: '',
      gender: '',
      tcKimlikNo: '',
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
    setForm({
      name: '',
      gender: '',
      tcKimlikNo: '',
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
  };

  const handleOpenPetDialog = () => {
    setEditingPetId(null);
    setPetForm({
      name: '',
      animalType: '',
      breed: '',
      microchipNumber: ''
    });
    setPetTouched({});
    setIsPetDialogOpen(true);
  };

  const handleClosePetDialog = () => {
    setIsPetDialogOpen(false);
    setEditingPetId(null);
    setPetForm({
      name: '',
      animalType: '',
      breed: '',
      microchipNumber: ''
    });
    setPetTouched({});
  };

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    // TC kimlik numarası için sadece rakam kabul et ve maksimum 11 karakter
    if (field === 'tcKimlikNo') {
      value = value.replace(/\D/g, '').slice(0, 11);
    }

    setForm((prev) => ({
      ...prev,
      [field]: value
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

  const isTcKimlikNoValid = (tcKimlikNo) => {
    if (!tcKimlikNo) return true; // Opsiyonel alan
    return /^\d{11}$/.test(tcKimlikNo);
  };

  const isTcKimlikNoUnique = (tcKimlikNo, editingPersonId) => {
    if (!tcKimlikNo) return true; // Opsiyonel alan
    try {
      if (!people || !Array.isArray(people)) return true;
      const deviceId = selectedDevice?._id || selectedDevice?.id;
      if (!deviceId) return true; // Cihaz seçilmemişse benzersiz kabul et

      const existingPerson = people.find(p => {
        try {
          return p &&
            p.tcKimlikNo === tcKimlikNo &&
            p.id !== editingPersonId &&
            (p.deviceId === deviceId);
        } catch (err) {
          return false;
        }
      });
      return !existingPerson;
    } catch (error) {
      console.error('Error checking TC kimlik uniqueness:', error);
      return true; // Hata durumunda benzersiz kabul et
    }
  };

  const isFormValid =
    form.name &&
    form.gender &&
    form.birthDate &&
    form.bloodGroup &&
    (!form.tcKimlikNo || (isTcKimlikNoValid(form.tcKimlikNo) && isTcKimlikNoUnique(form.tcKimlikNo, editingPersonId)));

  const handleSavePerson = async () => {
    if (!isFormValid) {
      setTouched({
        name: true,
        gender: true,
        tcKimlikNo: true,
        birthDate: true,
        bloodGroup: true
      });
      return;
    }

    const medicalConditionsArray = selectedDiseases.length
      ? selectedDiseases.map((d) => d.name)
      : (form.conditions ? form.conditions.split(',').map(s => s.trim()).filter(Boolean) : []);

    const medicationsArray = selectedMedications.length
      ? selectedMedications.map((m) => m.name)
      : (form.medications ? form.medications.split(',').map(s => s.trim()).filter(Boolean) : []);

    const prostheticsArray = selectedProsthetics.length
      ? selectedProsthetics.map((p) => p.name)
      : (form.prosthetics ? form.prosthetics.split(',').map(s => s.trim()).filter(Boolean) : []);

    const currentDeviceId = selectedDevice?._id || selectedDevice?.id || null;
    const currentDeviceName = selectedDevice?.name || null;

    const personPayload = {
      fullname: form.name,
      tcNumber: form.tcKimlikNo || undefined,
      gender: form.gender || undefined,
      birthDate: form.birthDate ? form.birthDate.format('YYYY-MM-DD') : undefined,
      bloodType: form.bloodGroup || undefined,
      medicalConditions: medicalConditionsArray,
      medications: medicationsArray,
      prosthetics: prostheticsArray
    };

    try {
      if (!currentDeviceId) throw new Error('Lütfen önce bir cihaz seçin.');

      // If adding a new person -> persist to backend
      if (!editingPersonId) {
        const { updatedGateway } = await addPersonToGateway(currentDeviceId, personPayload);
        // Map backend users to frontend people
        const mapped = (updatedGateway.registered_users || []).map((u) => ({
          id: u._id || u.id || Date.now().toString(),
          name: u.fullname || '',
          tcKimlikNo: u.tcNumber || '',
          gender: u.gender || '',
          birthDate: u.birthDate ? new Date(u.birthDate).toLocaleDateString('tr-TR') : '',
          bloodGroup: u.bloodType || '',
          conditions: Array.isArray(u.medicalConditions) ? u.medicalConditions.join(', ') : (u.medicalConditions || ''),
          medications: Array.isArray(u.medications) ? u.medications.join(', ') : (u.medications || ''),
          prosthetics: Array.isArray(u.prosthetics) ? u.prosthetics.join(', ') : (u.prosthetics || ''),
          deviceId: currentDeviceId,
          deviceName: currentDeviceName
        }));
        setPeople(mapped);

        // Also refresh pets from updatedGateway just in case
        const mappedPets = (updatedGateway.registered_animals || []).map((p) => ({
          id: p._id || p.id || Date.now().toString(),
          name: p.name || '',
          animalType: p.species || '',
          breed: p.breed || '',
          microchipNumber: p.microchipId || '',
          deviceId: currentDeviceId,
          deviceName: currentDeviceName
        }));
        setPets(mappedPets);
      } else {
        // Editing existing person: currently update happens locally (backend doesn't expose update endpoint)
        setPeople((prev) =>
          prev.map((p) =>
            p.id === editingPersonId
              ? {
                ...p,
                name: form.name,
                tcKimlikNo: form.tcKimlikNo || '',
                gender: form.gender || '',
                birthDate: form.birthDate ? form.birthDate.format('YYYY-MM-DD') : '',
                bloodGroup: form.bloodGroup || '',
                conditions: medicalConditionsArray.join(', '),
                medications: medicationsArray.join(', '),
                prosthetics: prostheticsArray.join(', ')
              }
              : p
          )
        );
      }

      handleCloseDialog();
    } catch (err) {
      console.error('Kişi ekleme hatası:', err);
      // TODO: show user-friendly error notification (snackbar) - can be added centrally
    }
  };

  const isPetFormValid = useMemo(() => {
    try {
      const basicFieldsValid = petForm.name && petForm.animalType && petForm.breed;
      if (!basicFieldsValid) return false;

      // Mikro çip numarası opsiyonel, eğer girilmişse geçerli ve benzersiz olmalı
      if (petForm.microchipNumber) {
        const isValid = isMicrochipNumberValid(petForm.microchipNumber);
        const isUnique = isMicrochipNumberUnique(petForm.microchipNumber, editingPetId);
        return isValid && isUnique;
      }

      return true;
    } catch (error) {
      console.error('Error in isPetFormValid:', error);
      // Hata durumunda sadece temel alanları kontrol et
      return petForm.name && petForm.animalType && petForm.breed;
    }
  }, [petForm.name, petForm.animalType, petForm.breed, petForm.microchipNumber, editingPetId, pets, selectedDevice]);

  const handleChangePet = (field) => (event) => {
    try {
      event.stopPropagation();
      let value = event.target.value;

      // Mikro çip numarası için sadece rakam kabul et ve maksimum 15 karakter
      if (field === 'microchipNumber') {
        value = value.replace(/\D/g, '').slice(0, 15);
      }

      setPetForm((prev) => ({
        ...prev,
        [field]: value
      }));
    } catch (error) {
      console.error('Error in handleChangePet:', error);
    }
  };

  const handleBlurPet = (field) => () => {
    setPetTouched((prev) => ({ ...prev, [field]: true }));
  };

  function isMicrochipNumberValid(microchipNumber) {
    if (!microchipNumber) return true; // Opsiyonel alan
    return /^\d{15}$/.test(microchipNumber);
  }

  function isMicrochipNumberUnique(microchipNumber, editingPetId) {
    if (!microchipNumber) return true; // Opsiyonel alan
    try {
      if (!pets || !Array.isArray(pets)) return true;
      const deviceId = selectedDevice?._id || selectedDevice?.id;
      if (!deviceId) return true; // Cihaz seçilmemişse benzersiz kabul et

      const existingPet = pets.find(p => {
        try {
          return p &&
            p.microchipNumber === microchipNumber &&
            p.id !== editingPetId &&
            (p.deviceId === deviceId);
        } catch (err) {
          return false;
        }
      });
      return !existingPet;
    } catch (error) {
      console.error('Error checking microchip uniqueness:', error);
      return true; // Hata durumunda benzersiz kabul et
    }
  }

  const isMicrochipNumberError = useMemo(() => {
    try {
      if (!petTouched.microchipNumber) return false;
      if (!petForm.microchipNumber) return false; // Opsiyonel alan
      return !isMicrochipNumberValid(petForm.microchipNumber) || !isMicrochipNumberUnique(petForm.microchipNumber, editingPetId);
    } catch (error) {
      console.error('Error checking microchip error:', error);
      return false;
    }
  }, [petTouched.microchipNumber, petForm.microchipNumber, editingPetId, pets, selectedDevice]);

  const getMicrochipHelperText = useMemo(() => {
    try {
      if (!petTouched.microchipNumber || !petForm.microchipNumber) {
        return '15 haneli benzersiz mikro çip numarası (opsiyonel)';
      }
      if (!isMicrochipNumberValid(petForm.microchipNumber)) {
        return 'Mikro çip numarası tam olarak 15 haneli rakamlardan oluşmalıdır.';
      }
      if (!isMicrochipNumberUnique(petForm.microchipNumber, editingPetId)) {
        return 'Bu mikro çip numarası zaten kullanılıyor. Lütfen farklı bir numara girin.';
      }
      return '15 haneli benzersiz mikro çip numarası (opsiyonel)';
    } catch (error) {
      console.error('Error getting helper text:', error);
      return '15 haneli benzersiz mikro çip numarası (opsiyonel)';
    }
  }, [petTouched.microchipNumber, petForm.microchipNumber, editingPetId, pets, selectedDevice]);

  const handleSavePet = async () => {
    if (!isPetFormValid) {
      setPetTouched({
        name: true,
        animalType: true,
        breed: true,
        microchipNumber: true
      });
      return;
    }

    const currentDeviceId = selectedDevice?._id || selectedDevice?.id || null;
    const currentDeviceName = selectedDevice?.name || null;

    const petPayload = {
      name: petForm.name,
      species: petForm.animalType,
      breed: petForm.breed,
      microchipId: petForm.microchipNumber || undefined
    };

    try {
      if (!currentDeviceId) throw new Error('Lütfen önce bir cihaz seçin.');

      if (!editingPetId) {
        const { updatedGateway } = await addPetToGateway(currentDeviceId, petPayload);

        const mappedPets = (updatedGateway.registered_animals || []).map((p) => ({
          id: p._id || p.id || Date.now().toString(),
          name: p.name || '',
          animalType: p.species || '',
          breed: p.breed || '',
          microchipNumber: p.microchipId || '',
          deviceId: currentDeviceId,
          deviceName: currentDeviceName
        }));
        setPets(mappedPets);
      } else {
        // editing locally (no backend update endpoint)
        setPets((prev) =>
          prev.map((pet) =>
            pet.id === editingPetId
              ? { ...pet, name: petForm.name, animalType: petForm.animalType, breed: petForm.breed, microchipNumber: petForm.microchipNumber }
              : pet
          )
        );
      }

      handleClosePetDialog();
    } catch (err) {
      console.error('Evcil hayvan ekleme hatası:', err);
      // TODO: user notification
    }
  };
  if (loadingMetadata) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Sistem verileri yükleniyor...</Typography>
      </Box>
    );
  }
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

      {/* Cihaz Seçimi Bölümü */}
      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: selectedDevice ? 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)' : 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 'auto' } }}>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Cihaz Seçimi
              </Typography>
              {selectedDevice ? (
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: selectedDevice.status === 'low_battery' ? '2px solid #d32f2f' : '1px solid rgba(0,0,0,0.08)',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <Chip
                    label={selectedDevice.status === 'active' ? 'Aktif & Hazır' : selectedDevice.status === 'low_battery' ? 'Pil Düşük!' : 'Pasif'}
                    color={selectedDevice.status === 'active' ? 'success' : 'error'}
                    icon={selectedDevice.status === 'active' ? <CheckCircleIcon /> : <WarningIcon />}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      fontWeight: '700',
                      fontSize: '0.75rem',
                      height: 28,
                      px: 1,
                      zIndex: 1
                    }}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'primary.light',
                          color: 'primary.main'
                        }}
                      >
                        <RouterIcon sx={{ fontSize: 24 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="800" sx={{ mb: 0.5, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                          {selectedDevice.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Son görülme: {formatLastSeen(selectedDevice.last_seen)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2, borderWidth: 1 }} />

                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                            <BatteryStdIcon color={getBatteryColor(selectedDevice.battery || 0)} sx={{ fontSize: 18 }} />
                            <Typography variant="caption" fontWeight="700" sx={{ fontSize: '0.75rem' }}>
                              Batarya
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={selectedDevice.battery || 0}
                            color={getBatteryColor(selectedDevice.battery || 0)}
                            sx={{ height: 6, borderRadius: 3, mb: 0.75 }}
                          />
                          <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: '800', fontSize: '0.95rem' }}>
                            %{selectedDevice.battery || 0}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                            <SmartphoneIcon color="primary" sx={{ fontSize: 18 }} />
                            <Typography variant="caption" fontWeight="700" sx={{ fontSize: '0.75rem' }}>
                              Bağlı Cihaz
                            </Typography>
                          </Stack>
                          <Typography variant="h6" fontWeight="800" color="primary.main" sx={{ mb: 0.25, fontSize: '1.25rem' }}>
                            {selectedDevice.connected_devices || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Telefon mesh ağına bağlı
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <SignalCellularAltIcon
                              color={selectedDevice.signal_quality === 'strong' ? 'success' : selectedDevice.signal_quality === 'medium' ? 'warning' : 'error'}
                              sx={{ fontSize: 20 }}
                            />
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mb: 0.25, display: 'block' }}>
                                Mesh Bağlantı Kalitesi
                              </Typography>
                              <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.85rem' }}>
                                {selectedDevice.signal_quality === 'strong' ? 'Mükemmel' : selectedDevice.signal_quality === 'medium' ? 'Orta Seviye' : 'Zayıf'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                  Kişi ve evcil hayvan eklemek için önce bir cihaz seçmelisiniz.
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<DevicesIcon />}
              onClick={handleOpenDeviceDialog}
              sx={{
                px: 3.5,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: 3,
                minWidth: { xs: '100%', md: 'auto' }
              }}
            >
              Cihaz Seç
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Kişiler Bölümü */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="700" sx={{ fontSize: { xs: '1.375rem', md: '1.625rem' } }}>
          Kişiler
        </Typography>
        {filteredPeople.length > 0 && (
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
            disabled={!selectedDevice}
            sx={{
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 3,
              opacity: selectedDevice ? 1 : 0.5
            }}
          >
            Kişi Ekle
          </Button>
        )}
      </Box>

      {!selectedDevice ? (
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
            Kişi eklemek için önce bir cihaz seçmelisiniz.
          </Typography>
        </Paper>
      ) : filteredPeople.length === 0 ? (
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
            disabled={!selectedDevice}
            sx={{
              px: 3.5,
              py: 1.25,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 3,
              opacity: selectedDevice ? 1 : 0.5
            }}
          >
            İlk Kişiyi Ekle
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filteredPeople.map((person) => (
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
                            label={person.gender === 'male' ? 'Erkek' : 'Kadın'}
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
                    <Box>
                      <IconButton
                        onClick={() => {
                          setEditingPersonId(person.id);
                          setForm({
                            name: person.name,
                            gender: person.gender,
                            tcKimlikNo: person.tcKimlikNo || '',
                            birthDate: person.birthDate ? dayjs(person.birthDate) : null,
                            bloodGroup: person.bloodGroup,
                            conditions: person.conditions || '',
                            medications: person.medications || '',
                            prosthetics: person.prosthetics || ''
                          });

                          // Mevcut rahatsızlıkları healthData listesindeki objelere eşleştir
                          const conditionsArray = person.conditions
                            ? person.conditions.split(',').map((s) => s.trim()).filter(Boolean)
                            : [];
                          const matchedDiseases = conditionsArray.map((name) =>
                            diseaseOptions.find((d) => d.name === name) || { id: name, name, category: 'Diğer' }
                          );
                          setSelectedDiseases(matchedDiseases);

                          // Mevcut ilaçları healthData listesindeki objelere eşleştir
                          const medicationsArray = person.medications
                            ? person.medications.split(',').map((s) => s.trim()).filter(Boolean)
                            : [];
                          const matchedMeds = medicationsArray.map((name) =>
                            medicationOptions.find((m) => m.name === name) || { id: name, name, category: 'Diğer' }
                          );
                          setSelectedMedications(matchedMeds);

                          // Mevcut protezleri healthData listesindeki objelere eşleştir
                          const prostheticsArray = person.prosthetics
                            ? person.prosthetics.split(',').map((s) => s.trim()).filter(Boolean)
                            : [];
                          const matchedProsthetics = prostheticsArray.map((name) =>
                            prostheticOptions.find((p) => p.name === name) || { id: name, name, category: 'Diğer' }
                          );
                          setSelectedProsthetics(matchedProsthetics);

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

                      <IconButton
                        onClick={async () => {
                          // Only allow delete for server-side records (have object id-like string)
                          try {
                            const personId = person.id;
                            const deviceId = person.deviceId || selectedDevice?._id || selectedDevice?.id;
                            if (!deviceId || !personId) return;
                            // Attempt to remove from backend
                            await removePersonFromGateway(deviceId, personId);
                            // Refresh local list
                            const remaining = people.filter((p) => p.id !== person.id);
                            setPeople(remaining);
                          } catch (err) {
                            console.error('Kişi silme hatası:', err);
                          }
                        }}
                        sx={{
                          ml: 1,
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
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
                    {person.tcKimlikNo && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                          TC Kimlik Numarası
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500, fontFamily: 'monospace' }}>
                          {person.tcKimlikNo}
                        </Typography>
                      </Box>
                    )}
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
                    {person.medications && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                          Kullandığı İlaçlar
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                          {person.medications}
                        </Typography>
                      </Box>
                    )}
                    {person.prosthetics && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                          Protez / Cihazlar
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                          {person.prosthetics}
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
          {filteredPets.length > 0 && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<PetsIcon />}
              onClick={handleOpenPetDialog}
              disabled={!selectedDevice}
              sx={{
                px: 3.5,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 3,
                opacity: selectedDevice ? 1 : 0.5
              }}
            >
              Evcil Hayvan Ekle
            </Button>
          )}
        </Box>

        {!selectedDevice ? (
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
              Evcil hayvan eklemek için önce bir cihaz seçmelisiniz.
            </Typography>
          </Paper>
        ) : filteredPets.length === 0 ? (
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
              disabled={!selectedDevice}
              sx={{
                px: 3.5,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: 3,
                opacity: selectedDevice ? 1 : 0.5
              }}
            >
              İlk Evcil Hayvanı Ekle
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {filteredPets.map((pet) => (
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
                            breed: pet.breed,
                            microchipNumber: pet.microchipNumber || ''
                          });
                          setPetTouched({});
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
                          Tür
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                          {pet.animalType}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                          Irk
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                          {pet.breed}
                        </Typography>
                      </Box>
                      {pet.microchipNumber && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                            Mikro Çip Numarası
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500, fontFamily: 'monospace' }}>
                            {pet.microchipNumber}
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
                  {genderEntries.map(([key, label]) => (
                    <FormControlLabel
                      key={key}
                      value={key}
                      control={<Radio />}
                      label={<Typography sx={{ fontSize: '1rem' }}>{label}</Typography>}
                    />
                  ))}
                </RadioGroup>
                {isRequiredError('gender') && (
                  <Typography variant="body2" color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                    Cinsiyet zorunlu bir alandır.
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="TC Kimlik Numarası"
                value={form.tcKimlikNo || ''}
                onChange={handleChange('tcKimlikNo')}
                onBlur={handleBlur('tcKimlikNo')}
                error={touched.tcKimlikNo && form.tcKimlikNo && (!isTcKimlikNoValid(form.tcKimlikNo) || !isTcKimlikNoUnique(form.tcKimlikNo, editingPersonId))}
                helperText={
                  touched.tcKimlikNo && form.tcKimlikNo
                    ? !isTcKimlikNoValid(form.tcKimlikNo)
                      ? 'TC kimlik numarası tam olarak 11 haneli rakamlardan oluşmalıdır.'
                      : !isTcKimlikNoUnique(form.tcKimlikNo, editingPersonId)
                        ? 'Bu TC kimlik numarası zaten kullanılıyor. Lütfen farklı bir numara girin.'
                        : ''
                    : '11 haneli benzersiz TC kimlik numarası (opsiyonel)'
                }
                placeholder="12345678901"
                inputProps={{
                  maxLength: 11,
                  pattern: '[0-9]*',
                  inputMode: 'numeric'
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '1rem'
                  }
                }}
              />

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
                {(metadata.bloodGroups || []).map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>

              {/* Rahatsızlıklar - healthData tabanlı dropdown */}
              <Autocomplete
                multiple
                options={diseaseOptions}
                getOptionLabel={(option) => option.name}
                value={selectedDiseases}
                onChange={(_, newValue) => {
                  setSelectedDiseases(newValue);
                  setForm((prev) => ({
                    ...prev,
                    conditions: newValue.map((d) => d.name).join(', ')
                  }));
                }}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Rahatsızlıklar"
                    placeholder="Rahatsızlık arayın veya seçin"
                    helperText="Kronik hastalıklar, alerjiler vb. sağlık durumlarınızı seçin"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      size="small"
                    />
                  ))
                }
                groupBy={(option) => option.category}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <Box
                      component="div"
                      sx={{
                        position: 'sticky',
                        top: '-8px',
                        padding: '8px 12px',
                        background: 'rgba(0, 76, 180, 0.08)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'primary.main',
                        zIndex: 1
                      }}
                    >
                      {params.group}
                    </Box>
                    <Box component="ul" sx={{ padding: 0 }}>
                      {params.children}
                    </Box>
                  </li>
                )}
                sx={{ width: '100%' }}
              />

              {/* Kullandığı İlaçlar - healthData tabanlı dropdown */}
              <Autocomplete
                multiple
                options={medicationOptions}
                getOptionLabel={(option) => option.name}
                value={selectedMedications}
                onChange={(_, newValue) => {
                  setSelectedMedications(newValue);
                  setForm((prev) => ({
                    ...prev,
                    medications: newValue.map((m) => m.name).join(', ')
                  }));
                }}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kullandığı İlaçlar"
                    placeholder="İlaç arayın veya seçin"
                    helperText="Düzenli olarak kullandığı ilaçları belirtin"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      size="small"
                    />
                  ))
                }
                groupBy={(option) => option.category}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <Box
                      component="div"
                      sx={{
                        position: 'sticky',
                        top: '-8px',
                        padding: '8px 12px',
                        background: 'rgba(0, 76, 180, 0.08)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'primary.main',
                        zIndex: 1
                      }}
                    >
                      {params.group}
                    </Box>
                    <Box component="ul" sx={{ padding: 0 }}>
                      {params.children}
                    </Box>
                  </li>
                )}
                sx={{ width: '100%' }}
              />

              {/* Protez / Tıbbi Cihazlar - healthData tabanlı dropdown */}
              <Autocomplete
                multiple
                options={prostheticOptions}
                getOptionLabel={(option) => option.name}
                value={selectedProsthetics}
                onChange={(_, newValue) => {
                  setSelectedProsthetics(newValue);
                  setForm((prev) => ({
                    ...prev,
                    prosthetics: newValue.map((p) => p.name).join(', ')
                  }));
                }}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kullandığı Protez / Cihazlar"
                    placeholder="Protez veya cihaz arayın veya seçin"
                    helperText="Kullandığı protez veya tıbbi cihazları belirtin"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      size="small"
                    />
                  ))
                }
                groupBy={(option) => option.category}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <Box
                      component="div"
                      sx={{
                        position: 'sticky',
                        top: '-8px',
                        padding: '8px 12px',
                        background: 'rgba(0, 76, 180, 0.08)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'primary.main',
                        zIndex: 1
                      }}
                    >
                      {params.group}
                    </Box>
                    <Box component="ul" sx={{ padding: 0 }}>
                      {params.children}
                    </Box>
                  </li>
                )}
                sx={{ width: '100%' }}
              />
            </Stack>
          </Box>
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
        onClose={(event, reason) => {
          // Sadece backdrop click veya escape key ile kapat
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            handleClosePetDialog();
          }
        }}
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
                  label="Tür"
                  value={petForm.animalType}
                  onChange={handleChangePet('animalType')}
                  placeholder="Örn. Kedi, Köpek vb."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Irk"
                  value={petForm.breed}
                  onChange={handleChangePet('breed')}
                  onBlur={handleBlurPet('breed')}
                  placeholder="Örn. Golden Retriever, Van Kedisi vb."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mikro Çip Numarası"
                  value={petForm.microchipNumber || ''}
                  onChange={handleChangePet('microchipNumber')}
                  onBlur={handleBlurPet('microchipNumber')}
                  error={isMicrochipNumberError}
                  helperText={getMicrochipHelperText}
                  placeholder="123456789012345"
                  inputProps={{
                    maxLength: 15,
                    pattern: '[0-9]*',
                    inputMode: 'numeric'
                  }}
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

      {/* Cihaz Seçim Diyaloğu */}
      <Dialog
        open={isDeviceDialogOpen}
        onClose={handleCloseDeviceDialog}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 4
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.375rem', fontWeight: 700, pb: 1.5 }}>
          Cihaz Seç
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2.5 }}>
          {loadingDevices ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : devices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <RouterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Henüz cihaz bulunmuyor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Önce cihazlarınız sayfasından bir cihaz eklemelisiniz.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {devices.map((device) => (
                <Grid item xs={12} md={6} key={device._id || device.id}>
                  <Card
                    elevation={0}
                    onClick={() => handleSelectDevice(device)}
                    sx={{
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: (selectedDevice?._id === device._id || selectedDevice?.id === device.id)
                        ? '2px solid #1976d2'
                        : device.status === 'low_battery'
                          ? '2px solid #d32f2f'
                          : '1px solid rgba(0,0,0,0.08)',
                      position: 'relative',
                      overflow: 'visible',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Chip
                      label={device.status === 'active' ? 'Aktif & Hazır' : device.status === 'low_battery' ? 'Pil Düşük!' : 'Pasif'}
                      color={device.status === 'active' ? 'success' : 'error'}
                      icon={device.status === 'active' ? <CheckCircleIcon /> : <WarningIcon />}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        height: 32,
                        px: 1,
                        zIndex: 1
                      }}
                    />

                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 2.5 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.light',
                            color: 'primary.main'
                          }}
                        >
                          <RouterIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" fontWeight="800" sx={{ mb: 0.5, fontSize: { xs: '1.125rem', md: '1.375rem' } }}>
                            {device.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                            Son görülme: {formatLastSeen(device.last_seen)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ mb: 2.5, borderWidth: 1 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'background.default',
                              borderRadius: 2,
                              border: '1px solid rgba(0,0,0,0.05)'
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                              <BatteryStdIcon color={getBatteryColor(device.battery || 0)} sx={{ fontSize: 20 }} />
                              <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.85rem' }}>
                                Batarya
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={device.battery || 0}
                              color={getBatteryColor(device.battery || 0)}
                              sx={{ height: 8, borderRadius: 4, mb: 1 }}
                            />
                            <Typography variant="h6" sx={{ textAlign: 'right', fontWeight: '800', fontSize: '1.125rem' }}>
                              %{device.battery || 0}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'background.default',
                              borderRadius: 2,
                              border: '1px solid rgba(0,0,0,0.05)'
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                              <SmartphoneIcon color="primary" sx={{ fontSize: 20 }} />
                              <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.85rem' }}>
                                Bağlı Cihaz
                              </Typography>
                            </Stack>
                            <Typography variant="h5" fontWeight="800" color="primary.main" sx={{ mb: 0.5, fontSize: '1.5rem' }}>
                              {device.connected_devices || 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              Telefon mesh ağına bağlı
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'background.default',
                              borderRadius: 2,
                              border: '1px solid rgba(0,0,0,0.05)'
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <SignalCellularAltIcon
                                color={device.signal_quality === 'strong' ? 'success' : device.signal_quality === 'medium' ? 'warning' : 'error'}
                                sx={{ fontSize: 24 }}
                              />
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.25 }}>
                                  Mesh Bağlantı Kalitesi
                                </Typography>
                                <Typography variant="body1" fontWeight="700" sx={{ fontSize: '0.95rem' }}>
                                  {device.signal_quality === 'strong' ? 'Mükemmel' : device.signal_quality === 'medium' ? 'Orta Seviye' : 'Zayıf'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleCloseDeviceDialog}
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CitizenCampusInfo;



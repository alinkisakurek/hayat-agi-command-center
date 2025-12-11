import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Stack,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { updateProfile, getProfile } from '../services/authService';
import { diseases, medications, prosthetics, getAllMedications } from '../data/healthData';

const CitizenSettings = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    bloodType: '',
    medicalConditions: [],
    prosthetics: [],
    birthDate: null,
    gender: '',
    medications: []
  });
  
  // Autocomplete için seçili değerler
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [selectedProsthetics, setSelectedProsthetics] = useState([]);
  const [savedData, setSavedData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  // Sayfa yüklendiğinde mevcut profil bilgilerini getir
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        // me endpoint'i direkt user objesi döndürüyor
        const userData = profile.user || profile;
        
        // String'leri array'e çevir
        const medicalConditionsArray = userData.medicalConditions 
          ? (Array.isArray(userData.medicalConditions) 
              ? userData.medicalConditions 
              : userData.medicalConditions.split(',').map(s => s.trim()).filter(Boolean))
          : [];
        
        const medicationsArray = userData.medications 
          ? (Array.isArray(userData.medications) 
              ? userData.medications 
              : userData.medications.split(',').map(s => s.trim()).filter(Boolean))
          : [];
        
        const prostheticsArray = userData.prosthetics 
          ? (Array.isArray(userData.prosthetics) 
              ? userData.prosthetics 
              : (typeof userData.prosthetics === 'string' 
                  ? userData.prosthetics.split(',').map(s => s.trim()).filter(Boolean)
                  : []))
          : [];
        
        // Rahatsızlıkları disease objelerine eşleştir
        const matchedDiseases = medicalConditionsArray.map(name => 
          diseases.find(d => d.name === name) || { id: name, name, category: 'Diğer' }
        );
        
        // İlaçları medication objelerine eşleştir
        const allMeds = getAllMedications();
        const matchedMedications = medicationsArray.map(name => 
          allMeds.find(m => m.name === name) || { id: name, name, category: 'Diğer' }
        );
        
        // Protezleri prosthetics objelerine eşleştir
        const matchedProsthetics = prostheticsArray.map(name => 
          prosthetics.find(p => p.name === name) || { id: name, name, category: 'Diğer' }
        );
        
        setSelectedDiseases(matchedDiseases);
        setSelectedMedications(matchedMedications);
        setSelectedProsthetics(matchedProsthetics);
        
        setFormData({
          phoneNumber: userData.phoneNumber || '',
          emergencyContactName: userData.emergencyContactName || '',
          emergencyContactPhone: userData.emergencyContactPhone || '',
          emergencyContactRelation: userData.emergencyContactRelation || '',
          bloodType: userData.bloodType || '',
          medicalConditions: medicalConditionsArray,
          prosthetics: prostheticsArray,
          birthDate: userData.birthDate ? dayjs(userData.birthDate) : null,
          gender: userData.gender || '',
          medications: medicationsArray
        });
        setSavedData(userData);
      } catch (error) {
        console.error('Profil bilgileri alınamadı:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDiseasesChange = (event, newValue) => {
    setSelectedDiseases(newValue);
    setFormData((prev) => ({
      ...prev,
      medicalConditions: newValue.map(d => d.name)
    }));
  };
  
  const handleMedicationsChange = (event, newValue) => {
    setSelectedMedications(newValue);
    setFormData((prev) => ({
      ...prev,
      medications: newValue.map(m => m.name)
    }));
  };
  
  const handleProstheticsChange = (event, newValue) => {
    setSelectedProsthetics(newValue);
    setFormData((prev) => ({
      ...prev,
      prosthetics: newValue.map(p => p.name),
      hasProsthesis: newValue.length > 0
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      // FormData'yı backend formatına çevir
      const submitData = {
        ...formData,
        birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : null,
        medicalConditions: formData.medicalConditions.join(', '),
        medications: formData.medications.join(', '),
        prosthetics: formData.prosthetics.join(', '),
        hasProsthesis: formData.prosthetics.length > 0
      };
      
      const response = await updateProfile(submitData);
      // updateProfile response'unda user objesi var
      const userData = response.user || response;
      setSavedData(userData);
      setSnackbarMessage(response.message || 'Profil ayarlarınız başarıyla kaydedildi.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message || 'Profil güncellenirken bir hata oluştu.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Profil Ayarları
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Telefon numaranızı ve acil durum kişilerinizi güncel tutarak afet durumlarında hızlı iletişim sağlayın.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
              İletişim Bilgileri
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Afet durumunda size ulaşabilmemiz için telefon numaranızı doğrulayın.
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
              <TextField
                label="Telefon Numaranız"
                placeholder="+90 5XX XXX XX XX"
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                required
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
              Acil Durum Kişisi
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sizin adınıza iletişime geçebileceğimiz bir yakınınızı ekleyin.
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Kişi Adı Soyadı"
                value={formData.emergencyContactName}
                onChange={handleChange('emergencyContactName')}
                required
              />
              <TextField
                label="Yakınlık Derecesi"
                placeholder="Örn. Kardeşim, Komşum"
                value={formData.emergencyContactRelation}
                onChange={handleChange('emergencyContactRelation')}
              />
              <TextField
                label="Telefon Numarası"
                placeholder="+90 5XX XXX XX XX"
                value={formData.emergencyContactPhone}
                onChange={handleChange('emergencyContactPhone')}
                required
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
              Sağlık Bilgileri
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Afet durumunda size daha iyi yardımcı olabilmemiz için sağlık bilgilerinizi paylaşın.
            </Typography>

            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Kan Grubu</InputLabel>
                <Select
                  value={formData.bloodType}
                  onChange={handleChange('bloodType')}
                  label="Kan Grubu"
                >
                  <MenuItem value="">Seçiniz</MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="0+">0+</MenuItem>
                  <MenuItem value="0-">0-</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                <DatePicker
                  label="Doğum Tarihi"
                  value={formData.birthDate}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      birthDate: newValue
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                  maxDate={dayjs()}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>

              <FormControl fullWidth>
                <InputLabel>Cinsiyet</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleChange('gender')}
                  label="Cinsiyet"
                >
                  <MenuItem value="">Seçiniz</MenuItem>
                  <MenuItem value="female">Kadın</MenuItem>
                  <MenuItem value="male">Erkek</MenuItem>
                  <MenuItem value="prefer_not_to_say">Belirtmek istemiyorum</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
                multiple
                options={diseases}
                getOptionLabel={(option) => option.name}
                value={selectedDiseases}
                onChange={handleDiseasesChange}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Rahatsızlıklar"
                    placeholder="Rahatsızlık arayın veya seçin"
                    helperText="Mevcut sağlık durumunuzu ve rahatsızlıklarınızı belirtin"
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

              <Autocomplete
                multiple
                options={getAllMedications()}
                getOptionLabel={(option) => option.name}
                value={selectedMedications}
                onChange={handleMedicationsChange}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kullandığınız İlaçlar"
                    placeholder="İlaç arayın veya seçin"
                    helperText="Düzenli olarak kullandığınız ilaçları belirtin"
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

              <Autocomplete
                multiple
                options={prosthetics}
                getOptionLabel={(option) => option.name}
                value={selectedProsthetics}
                onChange={handleProstheticsChange}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kullandığınız Protez/Cihaz"
                    placeholder="Protez veya cihaz arayın veya seçin"
                    helperText="Kullandığınız protez veya tıbbi cihazları belirtin"
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.05)',
              bgcolor: 'rgba(0, 76, 180, 0.04)'
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Son Kaydedilen Bilgiler
            </Typography>

            {savedData ? (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Telefon Numaranız
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {savedData.phoneNumber || 'Belirtilmemiş'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Acil Durum Kişisi
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {savedData.emergencyContactName || 'Belirtilmemiş'}
                  </Typography>
                  {savedData.emergencyContactRelation && (
                    <Typography variant="body2" color="text.secondary">
                      Yakınlık: {savedData.emergencyContactRelation}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Telefon: {savedData.emergencyContactPhone || 'Belirtilmemiş'}
                  </Typography>
                </Box>
                {(savedData.bloodType || savedData.gender || savedData.birthDate) && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Sağlık Bilgileri
                      </Typography>
                      {savedData.bloodType && (
                        <Typography variant="body2">
                          Kan Grubu: <strong>{savedData.bloodType}</strong>
                        </Typography>
                      )}
                      {savedData.gender && (
                        <Typography variant="body2">
                          Cinsiyet: <strong>
                            {savedData.gender === 'male' ? 'Erkek' : 
                             savedData.gender === 'female' ? 'Kadın' : 
                             savedData.gender === 'prefer_not_to_say' ? 'Belirtmek istemiyorum' : ''}
                          </strong>
                        </Typography>
                      )}
                      {savedData.birthDate && (
                        <Typography variant="body2">
                          Doğum Tarihi: <strong>
                            {new Date(savedData.birthDate).toLocaleDateString('tr-TR')}
                          </strong>
                        </Typography>
                      )}
                      {savedData.medicalConditions && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Rahatsızlıklar: <strong>
                            {typeof savedData.medicalConditions === 'string' 
                              ? savedData.medicalConditions 
                              : savedData.medicalConditions.join(', ')}
                          </strong>
                        </Typography>
                      )}
                      {savedData.medications && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          İlaçlar: <strong>
                            {typeof savedData.medications === 'string' 
                              ? savedData.medications 
                              : savedData.medications.join(', ')}
                          </strong>
                        </Typography>
                      )}
                      {savedData.prosthetics && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Protez/Cihaz: <strong>
                            {typeof savedData.prosthetics === 'string' 
                              ? savedData.prosthetics 
                              : savedData.prosthetics.join(', ')}
                          </strong>
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Henüz bir kayıt bulunmuyor. Bilgilerinizi kaydettikten sonra burada özetini görebilirsiniz.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CitizenSettings;



import React, { useState } from 'react';
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
  Stack
} from '@mui/material';

const CitizenSettings = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });
  const [savedData, setSavedData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSavedData(formData);
    setSnackbarOpen(true);
    // TODO: Bu veriler backend'e gönderilecek. Şimdilik sadece yerel state'te tutuluyor.
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type="submit" variant="contained" size="large">
                Bilgileri Kaydet
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
                    {savedData.phoneNumber}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Acil Durum Kişisi
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {savedData.emergencyContactName}
                  </Typography>
                  {savedData.emergencyContactRelation && (
                    <Typography variant="body2" color="text.secondary">
                      Yakınlık: {savedData.emergencyContactRelation}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Telefon: {savedData.emergencyContactPhone}
                  </Typography>
                </Box>
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
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Profil ayarlarınız kaydedildi.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CitizenSettings;



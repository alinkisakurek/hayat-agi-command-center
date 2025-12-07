import React, { useState } from 'react';
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
  Stack
} from '@mui/material';

const steps = ['Kimlik', 'Konum', 'Onay'];

const AddDeviceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [identity, setIdentity] = useState({
    serialNumber: '',
    name: ''
  });
  const isIdentityValid = identity.serialNumber.trim() && identity.name.trim();

  const handleNext = () => {
    if (activeStep === 0 && !isIdentityValid) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    // TODO: Bu kısımda backend'e kayıt işlemi yapılacak
    // Şimdilik sadece console.log ile önizleme bıraktık
    // eslint-disable-next-line no-console
    console.log('Yeni cihaz verisi:', {
      identity
      // Konum bilgisi harita bileşeninden seçilecek
    });
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
          <Stack spacing={2}>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.12)',
                height: 260,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                color: 'text.secondary',
                textAlign: 'center',
                px: 2
              }}
            >
              <Typography variant="body2">
                Buraya harita bileşeni entegre edilecek. Kullanıcı harita üzerinden bir nokta
                seçerek konumu belirleyebilecek.
              </Typography>
            </Box>
          </Stack>
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
              Seçilen konum, harita üzerinden belirlenecektir.
            </Typography>
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



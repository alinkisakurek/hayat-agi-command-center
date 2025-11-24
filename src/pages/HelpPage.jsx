import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Stack,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Navbar from '../components/Navbar';

const HelpPage = () => {
  const [formData, setFormData] = useState({
    adSoyad: '',
    email: '',
    mesaj: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata mesajını temizle
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validasyon
    if (!formData.adSoyad.trim()) {
      setError('Lütfen ad soyad alanını doldurun');
      return;
    }

    if (!formData.email.trim()) {
      setError('Lütfen email alanını doldurun');
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Lütfen geçerli bir email adresi girin');
      return;
    }

    if (!formData.mesaj.trim()) {
      setError('Lütfen mesaj alanını doldurun');
      return;
    }

    setLoading(true);

    try {
      // TODO: Backend API çağrısı buraya eklenecek
      // const response = await api.post('/support', formData);
      
      // Şimdilik simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        adSoyad: '',
        email: '',
        mesaj: ''
      });
    } catch (err) {
      setError('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 6,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Başlık */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                mb: 4,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}
            >
              Destek
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Hata/Success Mesajları */}
                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success">
                    Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                  </Alert>
                )}

                {/* Ad Soyad Input */}
                <TextField
                  fullWidth
                  id="adSoyad"
                  name="adSoyad"
                  label="Ad Soyad"
                  value={formData.adSoyad}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                {/* Email Input */}
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                {/* Mesaj Textarea */}
                <TextField
                  fullWidth
                  id="mesaj"
                  name="mesaj"
                  label="Mesaj"
                  multiline
                  rows={6}
                  value={formData.mesaj}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                {/* Send Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  disabled={loading}
                  sx={{
                    borderRadius: '28px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    mt: 2
                  }}
                >
                  {loading ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default HelpPage;


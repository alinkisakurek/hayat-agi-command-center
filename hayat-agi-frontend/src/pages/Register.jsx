import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
  MedicalServices,
  VerifiedUser,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { register } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    allowNotifications: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Input Değişikliklerini Yakala
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Kullanıcı yazarken hatayı temizle
  };

  // Kayıt İşlemi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasyonlar
    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.phoneNumber) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Kayıt olmak için Kullanım Koşullarını kabul etmelisiniz.');
      return;
    }

    setLoading(true);

    try {
      // Backend'e gidecek veri paketi
      const registerData = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        allowsNotifications: formData.allowNotifications
      };

      await register(registerData);
      navigate('/panel'); // Başarılıysa yönlendir

    } catch (err) {
      console.error('Kayıt hatası:', err);
      setError(err.response?.data?.message || 'Kayıt işlemi başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* SOL TARA: Görsel Alan (Desktop Only) */}
      <Grid
        item
        xs={false}
        sm={4}
        md={5}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 6,
          color: 'white'
        }}
      >
        {/* Mavi Overlay */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 86, 178, 0.85)' }} />

        {/* Sol İçerik */}
        <Box sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
              <MedicalServices fontSize="large" />
            </Box>
            <Typography variant="h5" fontWeight="bold">Hayat Ağı</Typography>
          </Box>
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 2, lineHeight: 1.2 }}>
            Her Saniyede <br /> Yanınızdayız
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Acil durumlarda en hızlı müdahale için güvenli ağımıza katılın. Sağlığınız ve güvenliğiniz bizim önceliğimiz.
          </Typography>
        </Box>
      </Grid>

      {/* SAĞ TARAF: Form Alanı */}
      <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
        <Box sx={{ my: 'auto', mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>

          {/* Mobil Logo */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1, mb: 4, color: 'primary.main' }}>
            <MedicalServices fontSize="large" />
            <Typography variant="h5" fontWeight="bold">Hayat Ağı</Typography>
          </Box>

          <Container maxWidth="sm">
            <Box sx={{ mb: 4 }}>
              <Typography component="h1" variant="h4" fontWeight="900" sx={{ mb: 1, color: '#1a202c' }}>
                Hesap Oluşturun
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hayat Ağı'na güvenle katılın
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                {/* Ad & Soyad */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    required fullWidth
                    id="name"
                    label="Ad"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Person color="action" /></InputAdornment>),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required fullWidth
                    id="lastName"
                    label="Soyad"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Person color="action" /></InputAdornment>),
                    }}
                  />
                </Grid>

                {/* E-posta */}
                <Grid item xs={12}>
                  <TextField
                    required fullWidth
                    id="email"
                    label="E-posta Adresi"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Email color="action" /></InputAdornment>),
                    }}
                  />
                </Grid>

                {/* Telefon */}
                <Grid item xs={12}>
                  <TextField
                    required fullWidth
                    id="phoneNumber"
                    label="Telefon Numarası"
                    name="phoneNumber"
                    placeholder="5XX XXX XX XX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary" fontWeight="bold">+90</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Şifreler */}
                <Grid item xs={12}>
                  <TextField
                    required fullWidth
                    name="password"
                    label="Şifre"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Lock color="action" /></InputAdornment>),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="şifreyi göster"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required fullWidth
                    name="confirmPassword"
                    label="Şifre Tekrar"
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Lock color="action" /></InputAdornment>),
                    }}
                  />
                </Grid>

                {/* Checkboxlar */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox name="agreeTerms" color="primary" checked={formData.agreeTerms} onChange={handleChange} />}
                    label={
                      <Typography variant="body2" color="text.secondary">
                        <Link href="#" underline="hover" fontWeight="bold">Kullanım Koşulları</Link>'nı ve <Link href="#" underline="hover" fontWeight="bold">Gizlilik Politikasını</Link> okudum, kabul ediyorum.
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox name="allowNotifications" color="primary" checked={formData.allowNotifications} onChange={handleChange} />}
                    label={
                      <Typography variant="body2" color="text.secondary">
                        Profilim ve sistem güncellemeleri hakkında bilgilendirilmek istiyorum.
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4, mb: 2, py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px 0 rgba(0, 86, 178, 0.39)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
              </Button>

              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Zaten hesabınız var mı?
                    <Link component={RouterLink} to="/login" variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
                      Giriş Yapın
                    </Link>
                  </Typography>
                </Grid>
              </Grid>

              {/* Güvenlik Rozeti */}
              <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <VerifiedUser fontSize="small" color="action" />
                <Typography variant="caption" fontWeight="medium">256-Bit SSL ile Güvenli Kayıt</Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;
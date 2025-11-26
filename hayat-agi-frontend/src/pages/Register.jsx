import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import { ROUTES } from '../constants/routes';

const Register = () => {
  const navigate = useNavigate();

  // Tek bir state yapısı yeterli
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Boş alan kontrolü
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurun');
      setLoading(false);
      return;
    }

    // 2. Email format kontrolü (Basit regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir e-posta adresi giriniz');
      setLoading(false);
      return;
    }

    // 3. Şifre uzunluk kontrolü
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      // TODO: Backend API çağrısı burada yapılacak
      // Örn: await authService.register(formData);
      console.log('Kayıt verileri:', formData);

      // Başarılı simülasyonu
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.LOGIN);
      }, 1000);

    } catch (err) {
      setError('Kayıt işlemi sırasında bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4, // Biraz daha yuvarlak hatlar
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo veya İkon Alanı */}
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <PersonIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>

          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Aramıza Katıl
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Hayat Ağı sistemine erişmek için hesap oluşturun.
          </Typography>

          {/* Hata Mesajı */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* FORM BAŞLANGICI */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2.5}>

              {/* Ad ve Soyad Yan Yana */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="Ad"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  id="lastName"
                  label="Soyad"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {/* E-posta */}
              <TextField
                fullWidth
                id="email"
                label="E-posta Adresi"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Şifre */}
              <TextField
                fullWidth
                id="password"
                label="Şifre"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Kayıt Butonu */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Hesap Oluştur'}
              </Button>
            </Stack>

            {/* Giriş Yap Linki */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Zaten bir hesabın var mı?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Giriş Yap
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
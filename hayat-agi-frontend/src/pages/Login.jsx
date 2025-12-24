import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
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
  Email,
  Lock,
  MedicalServices,
  VerifiedUser
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login as authLogin } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta ve şifre alanlarını doldurunuz.');
      return;
    }

    setLoading(true);
    try {
      const data = await authLogin(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log("Giriş Başarılı:", data.user);



      // Role'e göre yönlendirme
      if (data.user.role === 'admin' || data.user.role === 'administrator') {
        navigate(ROUTES.DASHBOARD);
      } else {
        // Vatandaş için panel'e yönlendir
        navigate('/panel');
      }


    } catch (err) {
      console.error("Login Hatası:", err);
      const errorMessage = err.message || err.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      p: 2
    }}>
      {/* Arka Plan Overlay (Mavi Tonlama) */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 86, 178, 0.85)', mixBlendMode: 'multiply', zIndex: 1 }} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', zIndex: 1 }} />

      {/* Ortalanmış Kart */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper elevation={12} sx={{ p: { xs: 4, md: 5 }, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fff' }}>

          {/* Logo ve Slogan (Kartın Üstüne Taşındı) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'primary.main' }}>
            <MedicalServices fontSize="large" />
            <Typography variant="h5" fontWeight="bold">Hayat Ağı</Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', fontStyle: 'italic' }}>
            "Güvenliğiniz İçin 7/24 Aktif"
          </Typography>

          {/* Başlık */}
          <Typography component="h1" variant="h4" fontWeight="800" sx={{ mb: 1, color: '#0f172a', textAlign: 'center' }}>
            Giriş Yap
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Hesabınıza erişmek için bilgilerinizi girin.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, width: '100%', borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* Email */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, color: '#0f172a' }}>E-posta Adresi</Typography>
              <TextField
                required fullWidth
                id="email"
                placeholder="ornek@hayatagi.com"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Email sx={{ color: '#94a3b8' }} /></InputAdornment>),
                  sx: { borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                }}
              />
            </Box>

            {/* Şifre */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, color: '#0f172a' }}>Şifre</Typography>
              <TextField
                required fullWidth
                name="password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Lock sx={{ color: '#94a3b8' }} /></InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="şifreyi göster"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#94a3b8' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                }}
              />
            </Box>

            {/* Beni Hatırla & Şifremi Unuttum */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" sx={{ '& .MuiSvgIcon-root': { borderRadius: 1 } }} />}
                label={<Typography variant="body2" color="text.secondary">Beni Hatırla</Typography>}
              />
              <Link href="#" variant="body2" fontWeight="bold" underline="hover" sx={{ color: 'primary.main' }}>
                Şifremi Unuttum?
              </Link>
            </Box>

            {/* Giriş Butonu */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: '#0056b2',
                '&:hover': { bgcolor: '#004494' },
                boxShadow: 'none'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
            </Button>

            {/* Kayıt Ol Linki */}
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Hesabınız yok mu?
                <Link component={RouterLink} to="/register" variant="body2" fontWeight="bold" sx={{ ml: 1, color: 'primary.main' }}>
                  Kayıt Olun
                </Link>
              </Typography>
            </Box>

            {/* Güvenlik Rozeti */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: '#94a3b8' }}>

            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
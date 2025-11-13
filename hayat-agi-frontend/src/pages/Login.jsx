import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Avatar,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Stack,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Session kontrolü yapılırken loading göster
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basit validasyon
    if (!email || !password) {
      setError('Lütfen email ve şifre alanlarını doldurun');
      setLoading(false);
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Lütfen geçerli bir email adresi girin');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        // Başarılı giriş - Dashboard'a yönlendir
        navigate(ROUTES.DASHBOARD);
      } else {
        setError(result.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
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
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo - Wireframe'de üstte ortada yuvarlak */}
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mb: 3,
              fontSize: '2rem',
            }}
          >
            HA
          </Avatar>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={3}>
              {/* Email Input */}
              <TextField
                fullWidth
                id="email"
                label="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoFocus
              />

              {/* Password Input */}
              <TextField
                fullWidth
                id="password"
                label="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2, mb: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş'}
              </Button>
            </Stack>

            {/* Footer Links - Wireframe'de alt kısımda */}
            <Stack spacing={1} sx={{ mt: 3, width: '100%' }}>
              <Link
                component={RouterLink}
                to={ROUTES.REGISTER}
                variant="body2"
                sx={{
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Don't have an account?
              </Link>
              <Link
                component={RouterLink}
                to={ROUTES.FORGOT_PASSWORD}
                variant="body2"
                sx={{
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Forgot Password?
              </Link>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;


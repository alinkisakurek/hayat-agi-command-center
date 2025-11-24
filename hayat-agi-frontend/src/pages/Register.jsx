import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTES } from '../constants/routes';

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError('');
    setFormData({
      firstName: '',
      lastName: '',
      title: '',
      password: '',
    });
  };

  const handleBack = () => {
    setSelectedRole(null);
    setError('');
    setFormData({
      firstName: '',
      lastName: '',
      title: '',
      password: '',
    });
  };

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

    // Validasyon
    if (!formData.firstName || !formData.lastName || !formData.password) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      setLoading(false);
      return;
    }

    // Şifre uzunluk kontrolü
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      // TODO: API çağrısı yapılacak
      console.log('Register data:', { role: selectedRole, ...formData });
      
      // Şimdilik başarılı kayıt simülasyonu
      setTimeout(() => {
        setLoading(false);
        // Başarılı kayıt sonrası login sayfasına yönlendir
        navigate(ROUTES.LOGIN);
      }, 1000);
    } catch (err) {
      setError('Kayıt yapılırken bir hata oluştu');
      setLoading(false);
    }
  };

  // Vatandaş kayıt formu
  const renderCitizenForm = () => (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Geri butonu */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Vatandaş Başlığı */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            color: 'primary.main',
          }}
        >
          Vatandaş
        </Typography>

        {/* Kayıt OL alt başlığı */}
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 4 }}>
          Kayıt OL
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Ad Input */}
            <TextField
              fullWidth
              id="firstName"
              label="Ad"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              disabled={loading}
              required
              autoFocus
            />

            {/* Soyad Input */}
            <TextField
              fullWidth
              id="lastName"
              label="Soyad"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              disabled={loading}
              required
            />

            {/* Şifre Input */}
            <TextField
              fullWidth
              id="password"
              label="Şifre"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={loading}
              required
            />

            {/* Kayıt OL Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt OL'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );

  // AFAD kayıt formu
  const renderAFADForm = () => (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Geri butonu */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* AFAD Başlığı */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            color: 'primary.main',
          }}
        >
          AFAD
        </Typography>

        {/* Kayıt OL alt başlığı */}
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 4 }}>
          Kayıt OL
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Adı Input */}
            <TextField
              fullWidth
              id="firstName"
              label="Adı"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              disabled={loading}
              required
              autoFocus
            />

            {/* Soyadı Input */}
            <TextField
              fullWidth
              id="lastName"
              label="Soyadı"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              disabled={loading}
              required
            />

            {/* Unvanı Input - Opsiyonel */}
            <TextField
              fullWidth
              id="title"
              label="Unvanı (?)"
              name="title"
              value={formData.title}
              onChange={handleInputChange('title')}
              disabled={loading}
              helperText="Opsiyonel"
            />

            {/* Şifre Input */}
            <TextField
              fullWidth
              id="password"
              label="Şifre"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={loading}
              required
            />

            {/* Kayıt OL Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt OL'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );

  // Role seçim ekranı
  const renderRoleSelection = () => (
    <Container maxWidth="md">
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
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Kayıt Ol
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ width: '100%' }}
        >
          {/* AFAD Çalışanı Kartı */}
          <Card
            sx={{
              flex: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
            onClick={() => handleSelectRole('afad')}
          >
            <CardActionArea
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                minHeight: 300,
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                {/* AFAD Logo - Büyük Daire */}
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    mb: 3,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  AFAD
                </Avatar>

                <Typography variant="h6" component="div" gutterBottom>
                  AFAD Çalışanı
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  olarak
                </Typography>
                <Typography variant="h6" component="div" color="primary.main">
                  Kayıt Ol
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/* Vatandaş Kartı */}
          <Card
            sx={{
              flex: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
            onClick={() => handleSelectRole('citizen')}
          >
            <CardActionArea
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                minHeight: 300,
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Vatandaş İkonu - Büyük Daire */}
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'secondary.main',
                    mb: 3,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>

                <Typography variant="h6" component="div" gutterBottom>
                  Vatandaş
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  olarak
                </Typography>
                <Typography variant="h6" component="div" color="primary.main">
                  Kayıt Ol
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Paper>
    </Container>
  );

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
      {selectedRole === 'afad' 
        ? renderAFADForm() 
        : selectedRole === 'citizen' 
        ? renderCitizenForm() 
        : renderRoleSelection()}
    </Box>
  );
};

export default Register;


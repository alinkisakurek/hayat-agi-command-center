import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    Alert,
    CircularProgress
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


        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);


        if (!formData.adSoyad.trim()) {
            setError('Lütfen "Ad Soyad" alanını boş bırakmayınız.');
            return;
        }

        if (!formData.email.trim()) {
            setError('Lütfen "Email" alanını boş bırakmayınız.');
            return;
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Lütfen geçerli bir e-posta adresi giriniz. (Örn: ornek@email.com)');
            return;
        }


        if (!formData.mesaj.trim()) {
            setError('Lütfen mesajınızı yazınız.');
            return;
        }


        if (formData.mesaj.length < 10) {
            setError('Mesajınız çok kısa. Lütfen derdinizi biraz daha detaylı anlatınız.');
            return;
        }

        setLoading(true);

        try {

            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess(true);
            setFormData({
                adSoyad: '',
                email: '',
                mesaj: ''
            });
        } catch (err) {
            setError('Sunucuya bağlanırken bir hata oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
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
                            p: { xs: 3, md: 6 }, // Mobilde daha az padding
                            borderRadius: 6,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
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

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Stack spacing={3}>


                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                )}


                                {success && (
                                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                                        Mesajınız başarıyla tarafımıza ulaştı. En kısa sürede size dönüş yapacağız.
                                    </Alert>
                                )}

                                <TextField
                                    fullWidth
                                    id="adSoyad"
                                    name="adSoyad"
                                    label="Ad Soyad"
                                    value={formData.adSoyad}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required // HTML5 validasyonunu da aktif eder
                                    error={!!error && !formData.adSoyad.trim()} // Hata varsa kırmızı çerçeve
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="E-posta Adresi"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    error={!!error && (!formData.email.trim() || (error.includes('geçerli') && formData.email))}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    id="mesaj"
                                    name="mesaj"
                                    label="Mesajınız"
                                    multiline
                                    rows={6}
                                    value={formData.mesaj}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    error={!!error && !formData.mesaj.trim()}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    endIcon={!loading && <SendIcon />}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: '28px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        mt: 2
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Gönder'}
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
import React from 'react';
import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: 'background.default', // Temadan gelen arka plan rengi
                py: 8, // Dikey boşluk (padding-y) - Ferahlık katar
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4} alignItems="center">

                    {/* --- SOL TARAF: YAZILAR VE BUTONLAR --- */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ pr: { md: 4 } }}> {/* Masaüstünde sağdan boşluk bırak */}

                            {/* Üst Başlık (Tagline) */}
                            <Typography
                                variant="subtitle1"
                                color="primary"
                                fontWeight="bold"
                                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
                            >
                                Deprem Sonrası Haberleşme
                            </Typography>

                            {/* Ana Başlık (H1) */}
                            <Typography
                                variant="h2"
                                component="h1"
                                color="text.primary"
                                fontWeight="800"
                                sx={{
                                    mb: 3,
                                    lineHeight: 1.2,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' } // Mobilde küçük, pc'de büyük
                                }}
                            >
                                İletişim Kesildiğinde <br />
                                <Box component="span" sx={{ color: 'primary.main' }}>Hayat Ağı</Box> Devrede.
                            </Typography>

                            {/* Açıklama Metni */}
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 4, fontSize: '1.1rem', maxWidth: 600 }}
                            >
                                Doğal afetlerde GSM ve internet altyapısı çökse bile, Hayat Ağı'nın
                                Mesh teknolojisi sayesinde sevdiklerinizle iletişimde kalın ve
                                acil durum sinyali gönderin.
                            </Typography>

                            {/* Buton Grubu */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    component={Link}
                                    to="/auth/register"
                                    sx={{
                                        borderRadius: '28px', // Modern yuvarlak buton
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Sisteme Katıl
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<PlayCircleOutlineIcon />}
                                    component={Link}
                                    to="/nasil-calisir"
                                    sx={{
                                        borderRadius: '28px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        borderWidth: 2,
                                        '&:hover': { borderWidth: 2 } // Hoverda kenarlık incelmesin
                                    }}
                                >
                                    Nasıl Çalışır?
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* --- SAĞ TARAF: GÖRSEL --- */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                '&::before': { // Görselin arkasındaki dekoratif daire
                                    content: '""',
                                    position: 'absolute',
                                    top: '-10%',
                                    right: '-10%',
                                    width: '120%',
                                    height: '120%',
                                    background: 'radial-gradient(circle, rgba(0,64,163,0.1) 0%, rgba(255,255,255,0) 70%)',
                                    zIndex: 0,
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                                // Yukarıdaki link yerine kendi görselini koyacaksın: src="/assets/hero-image.png"
                                alt="Hayat Ağı İletişim Sistemi"
                                sx={{
                                    width: '100%',
                                    maxWidth: 600,
                                    height: 'auto',
                                    borderRadius: 4, // Köşeleri yuvarlat
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', // Modern, yumuşak gölge
                                    zIndex: 1,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)' // Üzerine gelince hafif büyüme efekti
                                    }
                                }}
                            />
                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
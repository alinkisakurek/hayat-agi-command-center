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
                bgcolor: 'background.default',
                py: 8,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4} alignItems="center">


                    <Grid item xs={12} md={6}>
                        <Box sx={{ pr: { md: 4 } }}>


                            <Typography
                                variant="subtitle1"
                                color="primary"
                                fontWeight="bold"
                                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
                            >
                                Deprem Sonrası Haberleşme
                            </Typography>


                            <Typography
                                variant="h2"
                                component="h1"
                                color="text.primary"
                                fontWeight="800"
                                sx={{
                                    mb: 3,
                                    lineHeight: 1.2,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                                }}
                            >
                                İletişim Kesildiğinde <br />
                                <Box component="span" sx={{ color: 'primary.main' }}>Hayat Ağı</Box> Devrede.
                            </Typography>


                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 4, fontSize: '1.1rem', maxWidth: 600 }}
                            >
                                Sesiniz enkaz altında kalmasın. GSM ve internet altyapıları çökse bile, Hayat Ağı çalışmaya devam eder. Gelişmiş Mesh teknolojimiz sayesinde en zorlu koşullarda bile dünyaya bağlanın; konumunuzu ve hayati durumunuzu kurtarma ekiplerine saniyeler içinde ulaştırın.
                            </Typography>


                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    component={Link}
                                    to="/auth/register"
                                    sx={{
                                        borderRadius: '28px',
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
                                    to="https://www.youtube.com/watch?v=IPkQdDeW6Xg"
                                    sx={{
                                        borderRadius: '28px',
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        borderWidth: 2,
                                        '&:hover': { borderWidth: 2 }
                                    }}
                                >
                                    Nasıl Çalışır?
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                '&::before': {
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
                                src="./image/landingpage_photo1.png"
                                alt="Hayat Ağı İletişim Sistemi"
                                sx={{
                                    width: '100%',
                                    maxWidth: 600,
                                    height: 'auto',
                                    borderRadius: 4,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    zIndex: 1,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
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
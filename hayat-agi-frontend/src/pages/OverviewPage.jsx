import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// İkonlar
import PublicIcon from '@mui/icons-material/Public';
import LoopIcon from '@mui/icons-material/Loop';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GridViewIcon from '@mui/icons-material/GridView';

import Navbar from '../components/Navbar';

const features = [
    {
        title: 'Düşük Maliyet, Yüksek Erişim',
        description: 'ESP32 ve LoRa modülleriyle geliştirilen ekonomik donanımlarımız sayesinde, her hane kendi iletişim düğümüne sahip olabilir.',
        icon: <PublicIcon fontSize="inherit" />,
        color: '#002867' // Primary Blue
    },
    {
        title: 'Enkaz Altında Kesintisiz Bağ',
        description: 'İnternet yok mu? Sorun değil. BLE ve LoRa Mesh teknolojisi, enkaz altından dış dünyaya giden hayati bir veri köprüsü kurar.',
        icon: <LoopIcon fontSize="inherit" />,
        color: '#0057D9'
    },
    {
        title: 'Tamamen Altyapısız Çalışma',
        description: 'Baz istasyonları yıkılsa bile, kendi kendine yeten bataryalı düğümlerimiz iletişimi canlı tutar.',
        icon: <StarBorderIcon fontSize="inherit" />,
        color: '#008000'
    },
    {
        title: 'Yapay Zeka Destekli Öncelik',
        description: 'Algoritmalarımız, gelen binlerce çağrı arasından en kritik olanları tespit eder ve kurtarma ekiplerini oraya yönlendirir.',
        icon: <GridViewIcon fontSize="inherit" />,
        color: '#D32F2F'
    }
];

const FeaturesSection = () => {
    const theme = useTheme();

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    py: 15,
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, #f0f4fa 100%)`
                }}
            >

                <Box sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: alpha(theme.palette.primary.main, 0.05),
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>


                    <Box sx={{ mb: 10, textAlign: { xs: 'center', md: 'left' }, maxWidth: 800 }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 900,
                                color: 'text.primary',
                                lineHeight: 1.1,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                mb: 3
                            }}
                        >
                            Hayat Kurtaran <br />
                            <Box component="span" sx={{ color: 'primary.main' }}>Akıllı Teknolojiler.</Box>
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1.2rem', maxWidth: 600, lineHeight: 1.8 }}
                        >
                            Geleneksel sistemlerin çaresiz kaldığı anlarda devreye giren,
                            merkeziyetsiz ve dayanıklı mimarimizi keşfedin.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {features.map((item, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        p: 4,
                                        borderRadius: 6,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

                                        '&:hover': {
                                            transform: 'translateY(-12px)',
                                            boxShadow: `0 20px 40px ${alpha(item.color, 0.15)}`,
                                            borderColor: item.color,
                                            '& .icon-box': {
                                                transform: 'scale(1.1) rotate(5deg)',
                                                bgcolor: item.color,
                                                color: '#fff'
                                            }
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>


                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>

                                            <Box
                                                className="icon-box"
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 4,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '2rem',
                                                    bgcolor: alpha(item.color, 0.1),
                                                    color: item.color,
                                                    transition: 'all 0.4s ease',
                                                    mr: 3
                                                }}
                                            >
                                                {item.icon}
                                            </Box>

                                            <Typography
                                                variant="h5"
                                                component="h3"
                                                sx={{ fontWeight: 800, color: 'text.primary' }}
                                            >
                                                {item.title}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}
                                        >
                                            {item.description}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </Container>
            </Box>
        </>
    );
};

export default FeaturesSection;
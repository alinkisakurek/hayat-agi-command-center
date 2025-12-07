import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import Navbar from '../components/Navbar';

const pricingPlans = [
    {
        title: 'Bireysel',
        price: '1000 TL',
        features: [
            'Her ev için ayrı cihaz.',
            'Evdeki tüm kişileri takip eder.'
        ]
    },
    {
        title: 'Mahalle',
        price: '2000 TL',
        features: [
            'Mahalle düzeylerinde cihaz.',
            'Merkezden uzakta yerleşim yerlerinde kullanımı tavsiye edilir.'
        ]
    }
];

const OurPrices = () => {
    return (
        <>
            <Navbar />
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    {/* Başlık */}
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            mb: 8,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            textAlign: 'center'
                        }}
                    >
                        Fiyatlandırma Planımız
                    </Typography>

                    {/* Fiyatlandırma Kartları */}
                    <Grid container spacing={4} justifyContent="center">
                        {pricingPlans.map((plan, index) => (
                            <Grid item xs={12} md={5} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: 4,
                                        borderRadius: 6,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 4,
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Plan Başlığı */}
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            sx={{
                                                fontWeight: 800,
                                                color: 'text.primary',
                                                mb: 3,
                                                textAlign: 'center'
                                            }}
                                        >
                                            {plan.title}
                                        </Typography>

                                        {/* Fiyat */}
                                        <Typography
                                            variant="h3"
                                            component="div"
                                            sx={{
                                                fontWeight: 800,
                                                color: 'text.primary',
                                                mb: 4,
                                                textAlign: 'center',
                                                fontSize: { xs: '2rem', md: '2.5rem' }
                                            }}
                                        >
                                            {plan.price}
                                        </Typography>

                                        {/* Özellikler Listesi */}
                                        <List sx={{ mb: 4, flexGrow: 1 }}>
                                            {plan.features.map((feature, featureIndex) => (
                                                <ListItem key={featureIndex} sx={{ px: 0, py: 1 }}>
                                                    <ListItemText
                                                        primary={feature}
                                                        primaryTypographyProps={{
                                                            color: 'text.secondary',
                                                            sx: { fontSize: '1rem', lineHeight: 1.6 }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>

                                        {/* Sipariş Ver Butonu */}
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            sx={{
                                                borderRadius: '28px',
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 'bold',
                                                mt: 'auto'
                                            }}
                                        >
                                            Sipariş Ver
                                        </Button>
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

export default OurPrices;

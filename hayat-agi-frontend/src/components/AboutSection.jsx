import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';

// Kart Verileri
const cardData = [
    {
        title: 'Biz Kimiz?',
        description: 'Çankaya Üniversitesi Yazılım Mühendisliği 4. sınıf öğrencilerinden oluşan tutkulu bir ekibiz. Bitirme projemizle, ülkemizde yaşanan afetlerde iletişimi kesintisiz kılarak hayat kurtarmayı hedefliyoruz.',
        image: '../image/landingpage_photo2.png'
    },
    {
        title: 'Desteklerimiz',
        description: 'Projemiz, TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı kapsamında desteklenmektedir. ',
        image: '../image/landingpage_photo3.png'
    }
];

const AboutSection = () => {
    return (
        <Box
            component="section"
            sx={{
                py: 8,
                bgcolor: 'background.default'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">

                    {cardData.map((item, index) => (
                        <Grid item xs={12} md={5} key={index} >

                            <Card
                                elevation={0}
                                sx={{
                                    minHeight: 600,
                                    maxWidth: 400,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 6,
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


                                <Box
                                    sx={{
                                        width: 200,
                                        height: 200,
                                        mb: 3,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        bgcolor: 'action.hover',
                                        borderRadius: '50%',
                                        p: 2
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt={item.title}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>

                                <CardContent sx={{ p: 0 }}>
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 800,
                                            color: 'primary.main',

                                            letterSpacing: 1
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.7 }}
                                    >
                                        {item.description}
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Grid>
                    ))}

                </Grid>
            </Container>
        </Box >
    );
};

export default AboutSection;
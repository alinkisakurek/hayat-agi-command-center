import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createGateway } from '../api/gatewayService';

const AddGateway = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        status: 'active'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!formData.name || !formData.latitude || !formData.longitude) {
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        try {
            const gatewayData = {
                name: formData.name,
                status: formData.status,
                location: {
                    lat: parseFloat(formData.latitude),
                    lng: parseFloat(formData.longitude)
                }
            };
            await createGateway(gatewayData);
            navigate('/dashboard/gateways');
        } catch (err) {
            setError('Kayıt sırasında bir hata oluştu.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>Yeni Gateway Ekle</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        label="Cihaz Adı"
                        name="name"
                        fullWidth
                        required
                        onChange={handleChange}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Enlem (Latitude)"
                            name="latitude"
                            type="number"
                            fullWidth
                            required
                            onChange={handleChange}
                        />
                        <TextField
                            label="Boylam (Longitude)"
                            name="longitude"
                            type="number"
                            fullWidth
                            required
                            onChange={handleChange}
                        />
                    </Stack>

                    <Button type="submit" variant="contained" size="large">
                        Kaydet
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export default AddGateway;
import React from 'react';
import { Box, Typography } from '@mui/material';

const CitizenSettings = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Ayarlar
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Hesap ve sistem ayarları
      </Typography>
    </Box>
  );
};

export default CitizenSettings;


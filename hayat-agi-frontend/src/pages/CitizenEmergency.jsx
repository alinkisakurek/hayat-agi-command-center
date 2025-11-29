import React from 'react';
import { Box, Typography } from '@mui/material';

const CitizenEmergency = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Acil Durum
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Acil durum yönetimi ve bildirimler
      </Typography>
    </Box>
  );
};

export default CitizenEmergency;


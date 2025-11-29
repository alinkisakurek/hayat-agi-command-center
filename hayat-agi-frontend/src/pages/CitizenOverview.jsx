import React from 'react';
import { Box, Typography } from '@mui/material';

const CitizenOverview = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Genel Bakış
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Gateway cihazınızın durumu ve sistem bilgileri
      </Typography>
    </Box>
  );
};

export default CitizenOverview;


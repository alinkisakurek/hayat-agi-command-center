import React from 'react';
import { Box, Typography } from '@mui/material';

const CitizenMessages = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Mesajlar
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Mesajlarınız ve bildirimleriniz
      </Typography>
    </Box>
  );
};

export default CitizenMessages;


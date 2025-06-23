import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const NoData: React.FC<{ message: string }> = ({ message }) => (
  <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
    <Typography>{message}</Typography>
  </Box>
);

export default NoData;

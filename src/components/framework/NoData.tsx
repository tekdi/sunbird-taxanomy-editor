import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/material/styles';

const NoData: React.FC<{ message: string; sx?: SxProps }> = ({
  message,
  sx,
}) => (
  <Box
    sx={{
      background: '#f7f8fa',
      borderRadius: 2,
      px: 3,
      py: 3,
      my: 2,
      textAlign: 'left',
      color: 'text.secondary',
      ...sx,
    }}
  >
    <Typography
      variant="h6"
      sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}
    >
      {message}
    </Typography>
  </Box>
);

export default NoData;

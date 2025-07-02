import React from 'react';
import Alert from '@mui/material/Alert';
import type { AlertMessageProps } from '@/interfaces/LayoutInterface';

const AlertMessage: React.FC<AlertMessageProps> = ({
  severity,
  message,
  sx,
}) => {
  if (!message) return null;
  return (
    <Alert severity={severity} sx={sx}>
      {message}
    </Alert>
  );
};

export default AlertMessage;

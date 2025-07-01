import React from 'react';
import Alert, { AlertProps } from '@mui/material/Alert';

interface AlertMessageProps {
  severity: AlertProps['severity'];
  message: string;
  sx?: object;
}

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

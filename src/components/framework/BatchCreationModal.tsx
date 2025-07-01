import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface BatchCreationModalProps {
  open: boolean;
  title: string;
  items: Array<{ name: string; code: string; [key: string]: unknown }>;
  statuses: Array<{
    status: 'pending' | 'success' | 'failed';
    message?: string;
  }>;
  currentIndex: number;
  getItemLabel?: (item: Record<string, unknown>) => React.ReactNode;
}

const BatchCreationModal: React.FC<BatchCreationModalProps> = ({
  open,
  title,
  items,
  statuses,
  currentIndex,
  getItemLabel,
}) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List>
          {items.map((item, idx) => (
            <ListItem
              key={item.code + idx}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {getItemLabel ? getItemLabel(item) : `${item.name}`}
              </Typography>
              {statuses[idx]?.status === 'pending' && idx === currentIndex ? (
                <CircularProgress size={18} />
              ) : statuses[idx]?.status === 'success' ? (
                <CheckCircleIcon color="success" fontSize="small" />
              ) : statuses[idx]?.status === 'failed' ? (
                <CancelIcon color="error" fontSize="small" />
              ) : null}
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default BatchCreationModal;

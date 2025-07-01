import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface BatchStatusListProps {
  title: string;
  items: Array<{ name: string; code: string; [key: string]: unknown }>;
  statuses: Array<{
    status: 'pending' | 'success' | 'failed';
    message?: string;
  }>;
  onRetry: (idx: number) => void;
  typeLabel: string;
  getItemLabel?: (item: Record<string, unknown>) => React.ReactNode;
}

const BatchStatusList: React.FC<BatchStatusListProps> = ({
  title,
  items,
  statuses,
  onRetry,
  typeLabel,
  getItemLabel,
}) => {
  if (!items.length) return null;
  return (
    <Box mt={4}>
      <Typography variant="subtitle2" fontSize={16} fontWeight={600} mb={2}>
        {title}
      </Typography>
      <List>
        {items.map((item, idx) => (
          <ListItem
            key={item.code + idx}
            sx={{ display: 'flex', alignItems: 'center', py: 1, gap: 1 }}
          >
            <Typography variant="body2" sx={{ flex: 1 }}>
              {typeLabel}{' '}
              <b>{getItemLabel ? getItemLabel(item) : (item.name as string)}</b>
              :{' '}
              {statuses[idx]?.status === 'success' ? (
                <span style={{ color: 'green' }}>Successfully created</span>
              ) : statuses[idx]?.status === 'pending' ? (
                <CircularProgress size={16} />
              ) : (
                <span style={{ color: 'red' }}>
                  Failed
                  {statuses[idx]?.message ? ` - ${statuses[idx]?.message}` : ''}
                </span>
              )}
            </Typography>
            {statuses[idx]?.status === 'failed' && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => onRetry(idx)}
              >
                Retry
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BatchStatusList;

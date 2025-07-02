import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PendingItemsListProps {
  title: string;
  items: Array<{ code: string; [key: string]: unknown }>;
  getItemDetails: (item: Record<string, unknown>) => React.ReactNode;
  minWidth?: number;
}

const PendingItemsList: React.FC<PendingItemsListProps> = ({
  title,
  items,
  getItemDetails,
  minWidth = 220,
}) => {
  if (!items.length) return null;
  return (
    <Box mt={4}>
      <Typography variant="subtitle2" fontSize={16} fontWeight={600} mb={2}>
        {title}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {items.map((item, idx) => (
          <Box
            key={item.code + idx}
            sx={{
              border: '1px solid #eee',
              borderRadius: 2,
              p: 2,
              minWidth,
              background: '#fff',
            }}
          >
            {getItemDetails(item)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PendingItemsList;

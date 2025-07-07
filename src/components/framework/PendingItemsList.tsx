import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface PendingItemsListProps {
  title: string;
  items: Array<{ code: string; [key: string]: unknown }>;
  getItemDetails: (item: Record<string, unknown>) => React.ReactNode;
  minWidth?: number;
  onDelete?: (code: string) => void;
}

const PendingItemsList: React.FC<PendingItemsListProps> = ({
  title,
  items,
  getItemDetails,
  minWidth = 220,
  onDelete,
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
              position: 'relative',
            }}
          >
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(item.code)}
                sx={{ position: 'absolute', top: 4, right: 4 }}
                aria-label="Delete"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
            {getItemDetails(item)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PendingItemsList;

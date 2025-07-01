import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

interface ListOfExistingItemsProps {
  title: string;
  items: Array<Record<string, unknown>>;
  getItemDetails: (item: Record<string, unknown>) => React.ReactNode;
  onEdit?: (item: Record<string, unknown>) => void;
  editIconTooltip?: string;
  maxHeight?: number;
  emptyText?: string;
}

const ListOfExistingItems: React.FC<ListOfExistingItemsProps> = ({
  title,
  items,
  getItemDetails,
  onEdit,
  editIconTooltip,
  maxHeight = 200,
  emptyText = 'No items available.',
}) => {
  return (
    <Box
      sx={{
        maxHeight,
        overflowY: 'auto',
        border: '1px solid #eee',
        borderRadius: 2,
        background: '#fafbfc',
        mb: 4,
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{
          textTransform: 'uppercase',
          color: 'text.secondary',
          fontSize: 15,
          p: 2,
        }}
      >
        {title}
      </Typography>
      <List disablePadding>
        {items.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
            {emptyText}
          </Typography>
        ) : (
          items.map((item, idx) => (
            <React.Fragment key={String(item.identifier || item.code || idx)}>
              <ListItem
                alignItems="flex-start"
                sx={{ display: 'block', py: 2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flex: 1 }}>{getItemDetails(item)}</Box>
                  {onEdit && (
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item)}
                      sx={{ ml: 1 }}
                      title={editIconTooltip || 'Edit'}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </ListItem>
              {idx < items.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
};

export default ListOfExistingItems;

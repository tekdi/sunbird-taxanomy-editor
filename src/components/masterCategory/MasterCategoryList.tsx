import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { MasterCategoryListProps } from '@/interfaces/MasterCategoryInterface';

// This component renders a list of master categories with their details.
// Each category displays its name, code, and description, with a divider between each item.
const MasterCategoryList: React.FC<MasterCategoryListProps> = ({
  categories,
  loading,
  error,
}) => (
  <Box>
    {loading ? (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Alert severity="error" sx={{ textAlign: 'center', py: 2 }}>
        {error}
      </Alert>
    ) : (
      <Box
        sx={{
          maxHeight: 200,
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: 2,
          background: '#fafbfc',
        }}
      >
        <List disablePadding>
          {categories.map((cat, idx) => (
            <React.Fragment key={cat.identifier}>
              <ListItem
                alignItems="flex-start"
                sx={{ display: 'block', py: 2 }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Name: <span style={{ fontWeight: 400 }}>{cat.name}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Code: <span style={{ color: '#333' }}>{cat.code}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description:{' '}
                  <span style={{ color: '#333' }}>
                    {cat.description || '—'}
                  </span>
                </Typography>
              </ListItem>
              {idx < categories.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    )}
  </Box>
);

export default MasterCategoryList;

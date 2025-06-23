import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Chip from '@mui/material/Chip';
import { grey, green } from '@mui/material/colors';
import {
  RecentActivityItemProps,
  RecentListProps,
} from '@/interfaces/DashboardInterface';

// Inline RecentActivityItem as a subcomponent
const InlineRecentActivityItem: React.FC<RecentActivityItemProps> = ({
  title,
  time,
  status,
  user,
  id,
}) => (
  <Box
    sx={{
      py: 1.5,
      borderBottom: 1,
      borderColor: 'divider',
      '&:last-child': { borderBottom: 0 },
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {id ? (
            <Typography
              component={NextLink}
              href={`/frameworks/${id}`}
              color="text.primary"
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {title}
            </Typography>
          ) : (
            title
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {user} • {time}
        </Typography>
      </Box>
      <Chip
        label={status}
        size="small"
        sx={{
          bgcolor: status === 'Published' ? green[100] : grey[200],
          color: status === 'Published' ? green[800] : grey[700],
          fontWeight: 600,
        }}
      />
    </Box>
  </Box>
);

function RecentList<T>({
  title,
  loading,
  error,
  items,
  itemKey,
  itemToProps,
  viewAllHref,
}: Readonly<RecentListProps<T>>) {
  let content;
  if (loading) {
    content = (
      <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
        Loading {title.toLowerCase()}...
      </Box>
    );
  } else if (error) {
    content = (
      <Box sx={{ textAlign: 'center', py: 2, color: 'error.main' }}>
        {error}
      </Box>
    );
  } else if (items.length === 0) {
    content = (
      <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
        No recent activity.
      </Box>
    );
  } else {
    content = (
      <Box>
        {items.map((item) => (
          <InlineRecentActivityItem
            key={itemKey(item)}
            {...itemToProps(item)}
          />
        ))}
      </Box>
    );
  }
  return (
    <Card elevation={1} sx={{ borderRadius: 3, flex: 1, minWidth: 0 }}>
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          {title}
        </Typography>
      </Box>
      <CardContent sx={{ pt: 0 }}>
        {content}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            component={NextLink}
            href={viewAllHref}
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
          >
            View All {title}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RecentList;

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface OverviewCardProps {
  name: string;
  count: number;
}

// This component renders a card displaying an overview statistic.
// It accepts props for the name of the statistic and the count value.
const OverviewCard: React.FC<OverviewCardProps> = ({ name, count }) => (
  <Box
    borderRadius={3}
    border={1}
    borderColor="divider"
    bgcolor="#fff"
    p={4}
    minWidth={180}
    display="flex"
    flexDirection="column"
    alignItems="center"
    boxShadow="0 1px 4px rgba(0,0,0,0.04)"
  >
    <Typography color="text.primary" mb={1}>
      {name}
    </Typography>
    <Typography variant="h5" fontWeight={700} color="text.primary">
      {count}
    </Typography>
  </Box>
);

export default OverviewCard;

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { indigo } from '@mui/material/colors';
import { StatCardProps } from '@/interfaces/DashboardInterface';

// This component renders a card displaying a statistic with a title, value, and an icon.
// It accepts props for the title, value, and an icon component to display.
const StatCard: React.FC<StatCardProps> = ({ title, value, IconComponent }) => (
  <Card elevation={1} sx={{ borderRadius: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            fontWeight={700}
            mt={0.5}
            color="text.primary"
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: indigo[50],
            p: 1.5,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent sx={{ color: indigo[600], fontSize: 20 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;

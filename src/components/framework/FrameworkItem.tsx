import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { green, grey } from '@mui/material/colors';
import { Framework } from '@/types/FrameworkInterface';
import { formatDate } from '@/utils/HelperService';

const FrameworkItem: React.FC<{ framework: Framework }> = ({ framework }) => (
  <Box
    sx={{
      p: 2,
      borderBottom: 1,
      borderColor: 'divider',
      ':last-child': { borderBottom: 0 },
    }}
  >
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
    >
      <Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            {framework.name}
          </Typography>
          <Chip
            label={
              framework.status?.toLowerCase() === 'live' ? 'Published' : 'Draft'
            }
            size="small"
            sx={{
              ml: 2,
              bgcolor:
                framework.status?.toLowerCase() === 'live'
                  ? green[100]
                  : grey[200],
              color:
                framework.status?.toLowerCase() === 'live'
                  ? green[800]
                  : grey[700],
              fontWeight: 600,
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Channel: {framework.channel} • {framework.categories?.length ?? 0}{' '}
          categories • Last updated: {formatDate(framework.lastUpdatedOn ?? '')}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} gap={1}>
        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowOutwardIcon fontSize="small" />}
          component={Link}
          href={`/frameworks/${framework.identifier}`}
          sx={{ minWidth: 80 }}
        >
          View
        </Button>
        <Button
          variant="outlined"
          size="small"
          component={Link}
          href={`/frameworks/${framework.identifier}/edit`}
          sx={{ minWidth: 80 }}
        >
          Edit
        </Button>
      </Box>
    </Box>
  </Box>
);

export default FrameworkItem;

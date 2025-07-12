import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { blue, grey } from '@mui/material/colors';
import { Framework } from '@/interfaces/FrameworkInterface';
import { formatDate } from '@/utils/HelperService';
import {
  getLiveCategories,
  getLiveTerms,
  groupAssociationsByCategory,
} from '@/services/categoryService';
import OverviewCard from '@/components/framework/OverviewCard';
import CategoryCard from '@/components/framework/CategoryCard';
import NoData from '@/components/framework/NoData';
import type { Category } from '@/interfaces/CategoryInterface';

interface FrameworkDisplayProps {
  framework: Framework;
  onBadgeClick: (
    categories: Category[],
    termName: string,
    categoryName: string,
    clickedCategoryId?: string
  ) => void;
}

const FrameworkDisplay: React.FC<FrameworkDisplayProps> = ({
  framework,
  onBadgeClick,
}) => {
  const liveCategories = getLiveCategories(framework);
  const overviewItems = liveCategories.map((cat) => ({
    name: cat?.name || 'Unnamed Category',
    count: getLiveTerms(cat).length,
  }));

  return (
    <Box>
      {/* Framework Card */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              gap={2}
            >
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="h5" fontWeight={700}>
                    {framework.name}
                  </Typography>
                  <Chip
                    label={framework.status}
                    size="small"
                    clickable={false}
                    sx={{
                      bgcolor: blue[50],
                      color: blue[700],
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box display="flex" gap={1} alignItems="center" mb={1}>
                  <Typography variant="body1" color="text.secondary">
                    <b>Channel:</b> {framework.channel}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" mb={1}>
                  {framework.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last Updated: {formatDate(framework.lastUpdatedOn)}
                </Typography>
              </Box>
            </Box>
          }
        />
      </Card>

      {/* Overview Summary Section */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
          Overview
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
          {overviewItems.map((item) => (
            <OverviewCard key={item.name} name={item.name} count={item.count} />
          ))}
        </Box>
      </Box>

      {/* Categories Heading */}
      <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
        Categories
      </Typography>

      {liveCategories.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={4}>
          {liveCategories.map((category) =>
            category ? (
              <CategoryCard
                key={category.identifier}
                category={category}
                groupAssociationsByCategory={groupAssociationsByCategory}
                getLiveTerms={getLiveTerms}
                grey={grey}
                onBadgeClick={onBadgeClick}
              />
            ) : null
          )}
        </Box>
      ) : (
        <NoData message="No categories available" />
      )}
    </Box>
  );
};

export default FrameworkDisplay;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '@/components/layout/PageLayout';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { blue, grey } from '@mui/material/colors';
import { Framework } from '@/interfaces/FrameworkInterface';
import { formatDate } from '@/utils/HelperService';
import AssociationDetailsModal from '@/components/framework/AssociationDetailsModal';
import frameworkService from '@/services/frameworkService';
import {
  getLiveCategories,
  getLiveTerms,
  groupAssociationsByCategory,
} from '@/services/categoryService';
import OverviewCard from '@/components/framework/OverviewCard';
import CategoryCard from '@/components/framework/CategoryCard';
import NoData from '@/components/framework/NoData';
import { useAssociationModal } from '@/hooks/useAssociationModal';

const FrameworkDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [framework, setFramework] = useState<Framework | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleBadgeClick, modalProps } = useAssociationModal();

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setError('No framework specified in URL');
      setLoading(false);
      return;
    }
    const fetchFramework = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await frameworkService.getFrameworkById(id);
        setFramework(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch framework'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFramework();
  }, [id]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}>Loading...</Box>;
  if (error)
    return (
      <Box sx={{ textAlign: 'center', color: 'error.main', py: 8 }}>
        {error}
      </Box>
    );
  if (!framework || typeof framework !== 'object')
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        No framework data available.
      </Box>
    );

  const liveCategories = getLiveCategories(framework);

  // Calculate summary for all live categories
  const overviewItems = liveCategories.map((cat) => ({
    name: cat?.name || 'Unnamed Category',
    count: getLiveTerms(cat).length,
  }));

  return (
    <PageLayout>
      <Box maxWidth="lg" mx="auto" py={4}>
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
              <OverviewCard
                key={item.name}
                name={item.name}
                count={item.count}
              />
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
                  key={category.identifier || category.name || Math.random()}
                  category={category}
                  groupAssociationsByCategory={groupAssociationsByCategory}
                  getLiveTerms={getLiveTerms}
                  grey={grey}
                  onBadgeClick={handleBadgeClick}
                />
              ) : null
            )}
          </Box>
        ) : (
          <NoData message="No categories available" />
        )}
      </Box>
      {/* Association Details Modal */}
      <AssociationDetailsModal {...modalProps} />
    </PageLayout>
  );
};

export default FrameworkDetails;

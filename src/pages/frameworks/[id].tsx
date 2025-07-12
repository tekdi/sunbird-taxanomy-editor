import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '@/components/layout/PageLayout';
import Box from '@mui/material/Box';
import { Framework } from '@/interfaces/FrameworkInterface';
import AssociationDetailsModal from '@/components/framework/AssociationDetailsModal';
import frameworkService from '@/services/frameworkService';
import FrameworkDisplay from '@/components/framework/FrameworkDisplay';
import { useAssociationModal } from '@/hooks/useAssociationModal';

// This component displays detailed information about a specific framework.
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

    // Fetch framework details by ID
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

  return (
    <PageLayout>
      <Box maxWidth="lg" mx="auto" py={4}>
        <FrameworkDisplay
          framework={framework}
          onBadgeClick={handleBadgeClick}
        />
      </Box>
      {/* Association Details Modal */}
      <AssociationDetailsModal {...modalProps} />
    </PageLayout>
  );
};

export default FrameworkDetails;

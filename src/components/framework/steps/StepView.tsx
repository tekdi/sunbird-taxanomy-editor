import React, { useEffect, useState } from 'react';
import { useFrameworksStore } from '@/store/frameworksStore';
import Box from '@mui/material/Box';
import { Framework } from '@/interfaces/FrameworkInterface';
import AssociationDetailsModal from '@/components/framework/AssociationDetailsModal';
import FrameworkDisplay from '@/components/framework/FrameworkDisplay';
import { useAssociationModal } from '@/hooks/useAssociationModal';
import type { Category } from '@/interfaces/CategoryInterface';

// StepView expects the framework code as a prop (from the stepper context or parent)
interface StepViewProps {
  frameworkCode: string;
  framework?: Framework | null;
  categories?: Category[];
}

const StepView: React.FC<StepViewProps> = ({
  frameworkCode,
  framework: propFramework,
  categories: propCategories,
}) => {
  const { frameworks, fetchFrameworks } = useFrameworksStore();
  const [framework, setFramework] = useState<Framework | null>(
    propFramework ?? null
  );
  const [categories, setCategories] = useState<Category[] | undefined>(
    propCategories
  );
  const [localLoading, setLocalLoading] = useState(!propFramework);
  const [localError, setLocalError] = useState<string | null>(null);
  const { handleBadgeClick, modalProps } = useAssociationModal();

  useEffect(() => {
    if (propFramework) {
      setFramework(propFramework);
      setCategories(propCategories);
      setLocalLoading(false);
      setLocalError(null);
      return;
    }
    // Try to find the framework in the store first
    const fw = frameworks.find((fw) => fw.code === frameworkCode);
    if (fw) {
      setFramework(fw);
      setCategories(fw.categories);
      setLocalLoading(false);
      setLocalError(null);
    } else {
      // If not found, fetch all frameworks
      setLocalLoading(true);
      setLocalError(null);
      fetchFrameworks()
        .then(() => {
          const found = useFrameworksStore
            .getState()
            .frameworks.find((fw) => fw.code === frameworkCode);
          setFramework(found || null);
          setCategories(found?.categories);
          setLocalLoading(false);
          if (!found) setLocalError('Framework not found');
        })
        .catch((err) => {
          setLocalError(
            err instanceof Error ? err.message : 'Failed to fetch framework'
          );
          setLocalLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameworkCode, propFramework, propCategories]);

  if (localLoading)
    return <Box sx={{ textAlign: 'center', py: 8 }}>Loading...</Box>;
  if (localError)
    return (
      <Box sx={{ textAlign: 'center', color: 'error.main', py: 8 }}>
        {localError}
      </Box>
    );
  if (!framework || typeof framework !== 'object')
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        No framework data available.
      </Box>
    );

  // Prepare framework with categories for FrameworkDisplay
  const frameworkWithCategories = {
    ...framework,
    categories: categories ?? framework.categories,
  };

  return (
    <>
      <FrameworkDisplay
        framework={frameworkWithCategories}
        onBadgeClick={handleBadgeClick}
      />
      {/* Association Details Modal */}
      <AssociationDetailsModal {...modalProps} />
    </>
  );
};

export default StepView;

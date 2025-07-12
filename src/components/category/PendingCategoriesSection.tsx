import React from 'react';
import Button from '@mui/material/Button';
import PendingItemsList from '@/components/framework/PendingItemsList';

interface PendingCategoriesSectionProps {
  pendingCategories: {
    name: string;
    code: string;
    description: string;
  }[];
  getItemDetails: (item: Record<string, unknown>) => React.ReactNode;
  onCreate: () => void;
  onDelete: (code: string) => void;
}

const PendingCategoriesSection: React.FC<PendingCategoriesSectionProps> = ({
  pendingCategories,
  getItemDetails,
  onCreate,
  onDelete,
}) => {
  return (
    <>
      <PendingItemsList
        title="Categories to be created"
        items={pendingCategories}
        getItemDetails={getItemDetails}
        onDelete={onDelete}
      />
      {pendingCategories.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, minWidth: 180 }}
          onClick={onCreate}
          disabled={pendingCategories.length === 0}
        >
          Create Categories
        </Button>
      )}
    </>
  );
};

export default PendingCategoriesSection;

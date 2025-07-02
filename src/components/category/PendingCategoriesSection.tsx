import React from 'react';
import Button from '@mui/material/Button';
import PendingItemsList from '@/components/framework/PendingItemsList';
import type { PendingCategoriesSectionProps } from '@/interfaces/CategoryInterface';

const PendingCategoriesSection: React.FC<PendingCategoriesSectionProps> = ({
  pendingCategories,
  getItemDetails,
  onCreate,
}) => {
  return (
    <>
      <PendingItemsList
        title="Categories to be created"
        items={pendingCategories}
        getItemDetails={getItemDetails}
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

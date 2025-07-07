import React from 'react';
import Button from '@mui/material/Button';
import PendingItemsList from '@/components/framework/PendingItemsList';

interface PendingTermsSectionProps {
  pendingTerms: {
    name: string;
    code: string;
    description: string;
    label: string;
    categoryCode: string;
  }[];
  getItemDetails: (item: Record<string, unknown>) => React.ReactNode;
  onCreate: () => void;
  onDelete: (code: string) => void;
}

const PendingTermsSection: React.FC<PendingTermsSectionProps> = ({
  pendingTerms,
  getItemDetails,
  onCreate,
  onDelete,
}) => {
  return (
    <>
      <PendingItemsList
        title="Terms to be created"
        items={pendingTerms}
        getItemDetails={getItemDetails}
        onDelete={onDelete}
      />
      {pendingTerms.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, minWidth: 180 }}
          onClick={onCreate}
          disabled={pendingTerms.length === 0}
        >
          Create Terms
        </Button>
      )}
    </>
  );
};

export default PendingTermsSection;

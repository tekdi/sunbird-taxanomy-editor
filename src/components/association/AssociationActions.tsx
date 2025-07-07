import React from 'react';
import { Button, Box, Alert } from '@mui/material';
import type { BatchSaveResult } from '@/interfaces/AssociationInterface';

interface AssociationActionsProps {
  onClearAll: () => void;
  onSaveAssociations: () => void;
  canClearAll: boolean;
  canSaveAssociations: boolean;
  batchLoading: boolean;
  batchResult: BatchSaveResult | null;
}

const AssociationActions: React.FC<AssociationActionsProps> = ({
  onClearAll,
  onSaveAssociations,
  canClearAll,
  canSaveAssociations,
  batchLoading,
  batchResult,
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button
          onClick={onClearAll}
          disabled={!canClearAll}
          variant="outlined"
          color="secondary"
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Clear All Associations
        </Button>
        <Button
          onClick={onSaveAssociations}
          disabled={!canSaveAssociations}
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: 16,
            background: '#5b47fa',
          }}
        >
          {batchLoading ? 'Saving Associations...' : 'Save Associations'}
        </Button>
      </Box>
      {batchResult && (
        <Box sx={{ mt: 2 }}>
          <Alert severity={batchResult.failed === 0 ? 'success' : 'warning'}>
            {batchResult.success} associations saved, {batchResult.failed}{' '}
            failed.
          </Alert>
        </Box>
      )}
    </>
  );
};

export default AssociationActions;

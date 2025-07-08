import React from 'react';
import { Button, Box } from '@mui/material';

interface AssociationActionsProps {
  onClearAll: () => void;
  onSaveAssociations: () => void;
  canClearAll: boolean;
  canSaveAssociations: boolean;
  batchLoading: boolean;
}

const AssociationActions: React.FC<AssociationActionsProps> = ({
  onClearAll,
  onSaveAssociations,
  canClearAll,
  canSaveAssociations,
  batchLoading,
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button
          onClick={onClearAll}
          disabled={!canClearAll}
          variant="outlined"
          color="primary"
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Clear Selected
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
    </>
  );
};

export default AssociationActions;

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
} from '@mui/material';
import type { AssociationModalData } from '@/interfaces/AssociationInterface';

interface AssociationModalProps {
  open: boolean;
  onClose: () => void;
  modalData: AssociationModalData;
}

const AssociationModal: React.FC<AssociationModalProps> = ({
  open,
  onClose,
  modalData,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Associations for{' '}
        <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {modalData.term?.name}
        </Box>{' '}
        in{' '}
        <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {modalData.assocCategory?.name}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {modalData.assocTerms.length === 0 ? (
            <Typography color="text.secondary">
              No associated terms in this category.
            </Typography>
          ) : (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {modalData.assocTerms.map((assoc) => (
                <Typography
                  component="li"
                  key={assoc.code}
                  sx={{ mb: 0.5, fontSize: 16 }}
                >
                  {assoc.name}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssociationModal;

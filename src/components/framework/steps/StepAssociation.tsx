import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssociationDetailsModal from '@/components/framework/AssociationDetailsModal';
import { useAssociationModal } from '@/hooks/useAssociationModal';
import AssociationTable from '@/components/association/AssociationTable';
import TermSelector from '@/components/association/TermSelector';
import CategorySelector from '@/components/association/CategorySelector';
import TermChecklist from '@/components/association/TermChecklist';
import AssociationActions from '@/components/association/AssociationActions';
import { useStepAssociation } from '@/hooks/useStepAssociation';

const StepAssociation: React.FC = () => {
  // Association modal state
  const { modalProps } = useAssociationModal();

  // Use the main hook for all state and logic (including modal)
  const {
    // State
    categoriesWithTerms,
    selectedCategoryCode,
    selectedCategory,
    selectedTermCode,
    selectedTerm,
    availableCategories,
    selectedAvailableCategoryCode,
    selectedAvailableCategory,
    termsInAvailableCategory,
    checkedTermCodes,
    workingAssociationsList,
    allTermsWithAssociations,
    batchLoading,
    batchResult,
    modalOpen,
    modalData,

    // Handlers
    handleCategoryChange,
    handleTermChange,
    handleAvailableCategoryClick,
    handleToggleTerm,
    handleSaveAssociations,
    handleBatchSaveAssociations,
    handleClearAllAssociations,
    handleChipClick,
    handleCloseModal,
  } = useStepAssociation();

  return (
    <Box sx={{ px: { xs: 0, sm: 2 }, py: 1 }}>
      {/* Existing Associations Section */}
      {allTermsWithAssociations.length > 0 && (
        <Box sx={{ mt: 0, mb: 4 }}>
          <AssociationTable
            associations={allTermsWithAssociations}
            categories={categoriesWithTerms}
            onChipClick={handleChipClick}
            title="Existing Associations"
          />
          <AssociationDetailsModal {...modalProps} />
        </Box>
      )}

      {/* Association Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
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

      {/* Association Form Section */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 0.5,
        }}
      >
        Term Associations
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        Create associations between terms from different categories.
      </Typography>

      {categoriesWithTerms.length === 0 ? (
        <Alert
          severity="warning"
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <WarningAmberIcon fontSize="small" sx={{ mr: 1 }} />
          You need to create terms in multiple categories before creating
          associations.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Left Pane: Current Term Selection */}
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <TermSelector
              categoriesWithTerms={categoriesWithTerms}
              selectedCategoryCode={selectedCategoryCode}
              selectedTermCode={selectedTermCode}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onTermChange={handleTermChange}
            />
          </Box>

          {/* Center Pane: Available Categories */}
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <CategorySelector
              availableCategories={availableCategories}
              selectedAvailableCategoryCode={selectedAvailableCategoryCode}
              onCategoryClick={handleAvailableCategoryClick}
            />
          </Box>

          {/* Right Pane: Terms from Selected Category */}
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <TermChecklist
              selectedAvailableCategory={selectedAvailableCategory}
              termsInAvailableCategory={termsInAvailableCategory}
              checkedTermCodes={checkedTermCodes}
              selectedTerm={selectedTerm}
              onToggleTerm={handleToggleTerm}
            />
          </Box>
        </Box>
      )}

      {/* Add to List Button */}
      {selectedTerm && checkedTermCodes.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            onClick={handleSaveAssociations}
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Add to Association List
          </Button>
        </Box>
      )}

      {/* Association Preview */}
      <Box sx={{ mt: 4 }}>
        <AssociationTable
          associations={workingAssociationsList}
          categories={categoriesWithTerms}
          onChipClick={handleChipClick}
          title="Current Associations"
        />
      </Box>

      {/* Association Actions */}
      <AssociationActions
        onClearAll={handleClearAllAssociations}
        onSaveAssociations={handleBatchSaveAssociations}
        canClearAll={
          checkedTermCodes.length > 0 || workingAssociationsList.length > 0
        }
        canSaveAssociations={
          checkedTermCodes.length > 0 || workingAssociationsList.length > 0
        }
        batchLoading={batchLoading}
        batchResult={batchResult}
      />
    </Box>
  );
};

export default StepAssociation;

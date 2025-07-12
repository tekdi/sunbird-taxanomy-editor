import React, { useState, forwardRef, useImperativeHandle } from 'react';
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
import type { StepAssociationHandle } from '@/interfaces/AssociationInterface';
import CircularProgress from '@mui/material/CircularProgress';

const StepAssociation = forwardRef<StepAssociationHandle>((props, ref) => {
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
    batchResults,
    modalOpen,
    modalData,

    // Handlers
    handleCategoryChange,
    handleTermChange,
    handleAvailableCategoryClick,
    handleToggleTerm,
    handleSaveAssociations,
    handleBatchSaveAssociations,
    handleChipClick,
    handleCloseModal,
    setWorkingAssociationsList, // <-- add this to the hook if not present
    handleRetryBatchRequests,
    // Delete association modal state and handlers
    handleEditAssociation,
  } = useStepAssociation();

  // Selection state for preview table
  const [selectedPreviewIds, setSelectedPreviewIds] = useState<string[]>([]);

  // Selection handlers
  const handleSelectPreviewRow = (id: string) => {
    setSelectedPreviewIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleSelectAllPreview = (checked: boolean) => {
    setSelectedPreviewIds(
      checked ? workingAssociationsList.map((a) => a.identifier) : []
    );
  };

  // Clear selected associations only
  const handleClearSelectedAssociations = () => {
    setWorkingAssociationsList(
      workingAssociationsList.filter(
        (a) => !selectedPreviewIds.includes(a.identifier)
      )
    );
    setSelectedPreviewIds([]);
  };

  // Modal state for batch results
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  // Open modal when batchLoading or batchResults changes
  React.useEffect(() => {
    if (batchLoading || batchResults) {
      setBatchModalOpen(true);
    }
  }, [batchLoading, batchResults]);

  // Retry failed requests
  const handleRetry = () => {
    if (!batchResults) return;
    const failedInputs = batchResults
      .filter((r) => r.error)
      .map((r) => r.input);
    if (failedInputs.length > 0) {
      handleRetryBatchRequests(failedInputs);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      hasUnsavedAssociations: () => workingAssociationsList.length > 0,
      clearWorkingAssociations: () => {}, // No-op for now
    }),
    [workingAssociationsList]
  );

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
            showEditAction={true}
            showDeleteAction={false}
            onEdit={handleEditAssociation}
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

      {/* Batch Result Modal */}
      <Dialog
        open={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Batch Save Results</DialogTitle>
        <DialogContent>
          {batchLoading && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
              }}
            >
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Saving associations...</Typography>
            </Box>
          )}
          {!batchLoading && batchResults && (
            <>
              <Typography sx={{ mb: 2 }}>
                {batchResults.filter((r) => r.result).length} succeeded,{' '}
                {batchResults.filter((r) => r.error).length} failed
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8 }}>Term</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>
                        Category
                      </th>
                      <th style={{ textAlign: 'left', padding: 8 }}>
                        Associations
                      </th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((r) => (
                      <tr
                        key={`${r.input.fromTermCode}-${r.input.categoryCode}`}
                        style={{ background: r.error ? '#ffeaea' : '#eaffea' }}
                      >
                        <td style={{ padding: 8 }}>{r.input.fromTermCode}</td>
                        <td style={{ padding: 8 }}>{r.input.categoryCode}</td>
                        <td style={{ padding: 8 }}>
                          {r.input.associations
                            .map((a) => a.identifier)
                            .join(', ')}
                        </td>
                        <td style={{ padding: 8 }}>
                          {r.result ? (
                            <span style={{ color: 'green' }}>Success</span>
                          ) : (
                            <span style={{ color: 'red' }}>
                              {r.error?.message ?? 'Failed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              {batchResults.some((r) => r.error) && (
                <Button
                  onClick={handleRetry}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Retry Failed
                </Button>
              )}
            </>
          )}
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            onClick={() => setBatchModalOpen(false)}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
        </Box>
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
          title="Preview Associations"
          showSelection
          selectedIds={selectedPreviewIds}
          onSelectRow={handleSelectPreviewRow}
          onSelectAll={handleSelectAllPreview}
        />
      </Box>

      {/* Association Actions */}
      <AssociationActions
        onClearAll={handleClearSelectedAssociations}
        onSaveAssociations={handleBatchSaveAssociations}
        canClearAll={selectedPreviewIds.length > 0}
        canSaveAssociations={
          checkedTermCodes.length > 0 || workingAssociationsList.length > 0
        }
        batchLoading={batchLoading}
      />
    </Box>
  );
});

StepAssociation.displayName = 'StepAssociation';

export default StepAssociation;

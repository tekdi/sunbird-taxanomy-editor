import React, { forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import ListOfExistingItems from '@/components/framework/ListOfExistingItems';
import TermForm from '@/components/term/TermForm';
import PendingTermsSection from '@/components/term/PendingTermsSection';
import BatchCreationModal from '@/components/framework/BatchCreationModal';
import BatchStatusList from '@/components/framework/BatchStatusList';
import { getAllTermsFromCategories } from '@/services/categoryService';
import { useEditTerm } from '@/hooks/useEditTerm';
import { useStepTerms } from '@/hooks/useStepTerms';
import type { StepTermsHandle } from '@/interfaces/TermInterface';

const StepTerms = forwardRef<StepTermsHandle, object>((props, ref) => {
  const categories = useFrameworkFormStore((state) => state.categories);
  const setCategories = useFrameworkFormStore((state) => state.setCategories);
  const framework = useFrameworkFormStore((state) => state.framework);
  const channel = useFrameworkFormStore((state) => state.channel);

  const {
    form,
    setForm,
    error,
    setError,
    success,
    setSuccess,
    pendingTerms,
    batchStatus,
    modalOpen,
    modalStatuses,
    currentModalIndex,
    handleFormChange,
    handleAddTerm,
    handleBatchCreate,
    handleRetry,
  } = useStepTerms(categories, setCategories, framework);

  useImperativeHandle(ref, () => ({
    hasUnsavedTerms: () => pendingTerms.length > 0 || isEditMode,
  }));

  const { isEditMode, handleEditTerm, handleCancelEdit, handleUpdateTerm } =
    useEditTerm({
      categories,
      setCategories,
      framework,
      channel,
      form: {
        name: form.name,
        code: form.code,
        description: form.description,
        label: form.label,
        selectedCategory: form.selectedCategory,
      },
      setForm: (newForm) => {
        setForm({
          ...newForm,
          selectedCategory: newForm.selectedCategory,
        });
      },
      setError,
      setSuccess,
    });

  // Get all terms from all categories
  const allTerms = getAllTermsFromCategories(categories);

  // Reusable function to render term details - eliminates duplication
  const renderTermDetails = (term: Record<string, unknown>) => (
    <>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Name: <span style={{ fontWeight: 400 }}>{term.name as string}</span>
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Code: <span style={{ color: '#333' }}>{term.code as string}</span>
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Category:{' '}
        <span style={{ color: '#333' }}>
          {term.categoryName
            ? (term.categoryName as string)
            : categories.find((cat) => cat.code === term.categoryCode)?.name ??
              (term.categoryCode as string)}
        </span>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Description:{' '}
        <span style={{ color: '#333' }}>
          {(term.description as string) || '—'}
        </span>
      </Typography>
    </>
  );

  // Wrapper function to handle type compatibility
  const handleTermFormChange = (
    e:
      | { target: { name: string; value: string } }
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Convert the new FormChangeEvent type to the format expected by useStepTerms hook
    handleFormChange(e as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        gutterBottom
        sx={{
          textTransform: 'uppercase',
          color: 'text.secondary',
          fontSize: 15,
        }}
      >
        Terms
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Create terms for the categories in this framework.
      </Typography>

      <ListOfExistingItems
        title="Terms"
        items={allTerms}
        getItemDetails={renderTermDetails}
        onEdit={handleEditTerm}
        editIconTooltip="Edit Term"
        maxHeight={200}
        emptyText="No terms available."
      />

      {/* Add/Edit Term Form */}
      <TermForm
        form={form}
        categories={categories.map((cat) => ({
          code: cat.code,
          name: cat.name,
        }))}
        onChange={handleTermFormChange}
        onSubmit={isEditMode ? handleUpdateTerm : handleAddTerm}
        error={error}
        success={success}
        isEditMode={isEditMode}
        onCancel={isEditMode ? handleCancelEdit : undefined}
      />

      {/* Pending terms cards */}
      <PendingTermsSection
        pendingTerms={pendingTerms}
        getItemDetails={renderTermDetails}
        onCreate={handleBatchCreate}
      />
      {/* Modal for batch creation progress */}
      <BatchCreationModal
        open={modalOpen}
        title="Creating Terms"
        items={
          pendingTerms as unknown as Array<{
            name: string;
            code: string;
            [key: string]: unknown;
          }>
        }
        statuses={modalStatuses}
        currentIndex={currentModalIndex}
        getItemLabel={(item) =>
          `${item.name as string} (${item.categoryCode as string})`
        }
      />
      {/* Batch status results */}
      <BatchStatusList
        title="Creation Results"
        items={
          batchStatus as unknown as {
            [key: string]: unknown;
            name: string;
            code: string;
          }[]
        }
        statuses={batchStatus}
        onRetry={handleRetry}
        typeLabel="Term"
        getItemLabel={(item) =>
          `${item.name as string} in ${item.categoryCode as string}`
        }
      />
    </Box>
  );
});
StepTerms.displayName = 'StepTerms';
export default StepTerms;

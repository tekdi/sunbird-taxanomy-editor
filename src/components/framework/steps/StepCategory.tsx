import React, { forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import ListOfExistingItems from '@/components/framework/ListOfExistingItems';
import CategoryForm from '@/components/category/CategoryForm';
import PendingCategoriesSection from '@/components/category/PendingCategoriesSection';
import BatchCreationModal from '@/components/framework/BatchCreationModal';
import BatchStatusList from '@/components/framework/BatchStatusList';
import { useStepCategory } from '@/hooks/useStepCategory';

export interface StepCategoryHandle {
  hasUnsavedCategories: () => boolean;
}

const StepCategory = forwardRef<StepCategoryHandle, object>((props, ref) => {
  const categories = useFrameworkFormStore((state) => state.categories);
  const setCategories = useFrameworkFormStore((state) => state.setCategories);
  const framework = useFrameworkFormStore((state) => state.framework);

  const {
    form,
    error,
    success,
    pendingCategories,
    batchStatus,
    modalOpen,
    modalStatuses,
    currentModalIndex,
    handleFormChange,
    handleAddCategory,
    handleBatchCreate,
    handleRetry,
    hasUnsavedCategories,
  } = useStepCategory(categories, setCategories, framework);

  useImperativeHandle(ref, () => ({
    hasUnsavedCategories,
  }));

  // Reusable function to render category details
  const renderCategoryDetails = (cat: Record<string, unknown>) => (
    <>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Name: <span style={{ fontWeight: 400 }}>{cat.name as string}</span>
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Code: <span style={{ color: '#333' }}>{cat.code as string}</span>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Description:{' '}
        <span style={{ color: '#333' }}>
          {(cat.description as string) || '—'}
        </span>
      </Typography>
    </>
  );

  // Wrapper function to handle type compatibility
  const handleCategoryFormChange = (
    e:
      | { target: { name: string; value: string } }
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Convert the new FormChangeEvent type to the format expected by useStepCategory hook
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
        Categories
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        These are the available categories for this framework.
      </Typography>
      <ListOfExistingItems
        title="Categories"
        items={categories as unknown as Record<string, unknown>[]}
        getItemDetails={renderCategoryDetails}
        maxHeight={200}
        emptyText="No categories available."
      />
      <CategoryForm
        form={form}
        onChange={handleCategoryFormChange}
        onSubmit={handleAddCategory}
        error={error}
        success={success}
        isEditMode={false}
      />
      {/* Pending categories cards and create button */}
      <PendingCategoriesSection
        pendingCategories={pendingCategories}
        getItemDetails={renderCategoryDetails}
        onCreate={handleBatchCreate}
      />
      {/* Modal for batch creation progress */}
      <BatchCreationModal
        open={modalOpen}
        title="Creating Categories"
        items={
          pendingCategories as unknown as {
            [key: string]: unknown;
            name: string;
            code: string;
          }[]
        }
        statuses={modalStatuses}
        currentIndex={currentModalIndex}
        getItemLabel={(item) => item.name as string}
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
        typeLabel="Category"
        getItemLabel={(item) => item.name as string}
      />
    </Box>
  );
});
StepCategory.displayName = 'StepCategory';
export default StepCategory;

import { useState } from 'react';
import {
  batchCreateCategories,
  retryCreateCategory,
  CategoryInput,
} from '@/services/categoryService';
import { Category } from '@/interfaces/CategoryInterface';
import { Framework } from '@/interfaces/FrameworkInterface';
import { useFormHandler } from './useFormHandler';
import { useRetryHandler } from './useRetryHandler';
import { useBatchHandler } from './useBatchHandler';

// Local type for batch status to match the hook interface
type LocalBatchStatus = {
  name: string;
  code: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
};

// Extend CategoryInput to match BatchItem interface
type ExtendedCategoryInput = CategoryInput & { [key: string]: unknown };

export function useStepCategory(
  categories: Category[],
  setCategories: (categories: Category[]) => void,
  framework: Partial<Framework> | null
) {
  // Use the form handler hook
  const { form, setForm, handleFormChange } = useFormHandler(
    {
      name: '',
      code: '',
      description: '',
    },
    {
      enableCodeAutoFill: true,
      enableDescriptionAutoFill: true,
    }
  );

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingCategories, setPendingCategories] = useState<
    ExtendedCategoryInput[]
  >([]);
  const [batchStatus, setBatchStatus] = useState<LocalBatchStatus[]>([]);

  // Wrapper function to match the expected type signature
  const wrappedBatchCreateCategories = async (
    items: ExtendedCategoryInput[],
    frameworkCode: string
  ) => {
    const results = await batchCreateCategories(items, frameworkCode);
    return results.map((result) => ({
      ...result,
      category: {
        ...result.category,
        [Symbol.toStringTag]: 'CategoryInput',
      } as ExtendedCategoryInput,
    }));
  };

  // Use the batch handler hook
  const {
    modalOpen,
    setModalOpen,
    modalStatuses,
    setModalStatuses,
    currentModalIndex,
    setCurrentModalIndex,
    handleBatchCreate,
  } = useBatchHandler(
    pendingCategories,
    setPendingCategories,
    batchStatus,
    setBatchStatus,
    framework,
    wrappedBatchCreateCategories,
    (result) => {
      // Success callback - add to categories
      if (result.category) {
        setCategories([
          ...categories,
          {
            identifier: result.category.code,
            name: result.category.name,
            code: result.category.code,
            description: result.category.description,
            status: 'Live',
          },
        ]);
      }
    }
  );

  // Use the retry handler hook
  const { handleRetry: retryHandler } = useRetryHandler(
    batchStatus,
    setBatchStatus,
    framework,
    async (item, frameworkCode) => {
      await retryCreateCategory(item, frameworkCode);
    },
    (item) => {
      // Success callback - add to categories
      setCategories([
        ...categories,
        {
          identifier: item.code,
          name: item.name,
          code: item.code,
          description: item.description,
          status: 'Live',
        },
      ]);
    }
  );

  // Add category to local pending list
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingCategories((prev) => [
      ...prev,
      {
        name: form.name,
        code: form.code,
        description: form.description,
      },
    ]);
    setForm({ name: '', code: '', description: '' });
    setError(null);
    setSuccess(null);
  };

  // Remove category from pending list by code
  const handleDeletePendingCategory = (code: string) => {
    setPendingCategories((prev) => prev.filter((cat) => cat.code !== code));
  };

  const hasUnsavedCategories = () => pendingCategories.length > 0;

  return {
    form,
    setForm,
    error,
    setError,
    success,
    setSuccess,
    pendingCategories,
    setPendingCategories,
    batchStatus,
    setBatchStatus,
    modalOpen,
    setModalOpen,
    modalStatuses,
    setModalStatuses,
    currentModalIndex,
    setCurrentModalIndex,
    handleFormChange,
    handleAddCategory,
    handleBatchCreate,
    handleRetry: retryHandler,
    hasUnsavedCategories,
    handleDeletePendingCategory,
  };
}

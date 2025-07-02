import { useState } from 'react';
import {
  batchCreateTerms,
  retryCreateTerm,
  TermInput,
} from '@/services/termService';
import { Category } from '@/interfaces/CategoryInterface';
import { Framework } from '@/interfaces/FrameworkInterface';
import { useFormHandler } from './useFormHandler';
import { useRetryHandler } from './useRetryHandler';

// Local types for terms with proper index signatures
interface TermBatchStatus {
  name: string;
  code: string;
  description: string;
  label: string;
  categoryCode: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  [key: string]: unknown;
}

interface TermFormState {
  name: string;
  code: string;
  description: string;
  label: string;
  selectedCategory: string;
  [key: string]: unknown; // Add index signature
}

export function useStepTerms(
  categories: Category[],
  setCategories: (categories: Category[]) => void,
  framework: Partial<Framework> | null
) {
  // Use the form handler hook with custom field handling for terms
  const { form, setForm, handleFormChange } = useFormHandler<TermFormState>(
    {
      name: '',
      code: '',
      description: '',
      label: '',
      selectedCategory: '',
    },
    {
      enableCodeAutoFill: true,
      enableDescriptionAutoFill: true,
    }
  );

  // Custom form change handler to also set label when name changes
  const handleTermFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<{ value: unknown }>
      | import('@mui/material/Select').SelectChangeEvent<string>
  ) => {
    // First call the base form handler
    handleFormChange(e);

    // Additional logic for terms: set label to name value
    const target = e.target as
      | HTMLInputElement
      | { name?: string; value: unknown };
    const name = target.name ?? '';
    const value = target.value;

    if (name === 'name') {
      setForm((prev) => ({ ...prev, label: value as string }));
    }
  };

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingTerms, setPendingTerms] = useState<TermInput[]>([]);
  const [batchStatus, setBatchStatus] = useState<TermBatchStatus[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatuses, setModalStatuses] = useState<
    Array<{
      name: string;
      code: string;
      description: string;
      label: string;
      categoryCode: string;
      status: 'pending' | 'success' | 'failed';
      message?: string;
    }>
  >([]);
  const [currentModalIndex, setCurrentModalIndex] = useState<number>(0);

  // Use the retry handler hook
  const { handleRetry } = useRetryHandler(
    batchStatus,
    setBatchStatus,
    framework,
    async (item, frameworkCode) => {
      // Convert RetryInput to TermInput format
      const termBatchItem = item as unknown as TermBatchStatus;
      await retryCreateTerm(
        {
          name: termBatchItem.name,
          code: termBatchItem.code,
          description: termBatchItem.description,
          label: termBatchItem.label,
          categoryCode: termBatchItem.categoryCode,
        },
        frameworkCode
      );
    },
    (item) => {
      // Success callback - add to categories
      const termBatchItem = item as unknown as TermBatchStatus;
      const updatedCategories = [...categories];
      const categoryIndex = updatedCategories.findIndex(
        (cat) => cat.code === termBatchItem.categoryCode
      );
      if (categoryIndex !== -1) {
        const newTerm = {
          identifier: item.code,
          name: item.name,
          code: item.code,
          description: item.description,
          label: termBatchItem.label,
          status: 'Live',
        };
        updatedCategories[categoryIndex].terms ??= [];
        updatedCategories[categoryIndex].terms.push(newTerm);
        setCategories(updatedCategories);
      }
    }
  );

  // Add term to local pending list
  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.selectedCategory) {
      setError('Please select a category');
      return;
    }
    const selectedCategory = categories.find(
      (cat) => cat.code === form.selectedCategory
    );
    if (!selectedCategory) {
      setError('Selected category not found');
      return;
    }
    setPendingTerms((prev) => [
      ...prev,
      {
        name: form.name,
        code: form.code,
        description: form.description,
        label: form.label,
        categoryCode: form.selectedCategory,
      },
    ]);
    setForm({
      name: '',
      code: '',
      description: '',
      label: '',
      selectedCategory: '',
    });
    setError(null);
    setSuccess(null);
  };

  // Batch create terms with modal
  const handleBatchCreate = async () => {
    setModalOpen(true);
    setBatchStatus([]);
    setModalStatuses(
      pendingTerms.map((term) => ({
        name: term.name,
        code: term.code,
        description: term.description,
        label: term.label,
        categoryCode: term.categoryCode,
        status: 'pending' as const,
      }))
    );
    setCurrentModalIndex(0);
    const frameworkCode = framework?.code;
    if (!frameworkCode) {
      setModalStatuses(
        pendingTerms.map((term) => ({
          name: term.name,
          code: term.code,
          description: term.description,
          label: term.label,
          categoryCode: term.categoryCode,
          status: 'failed' as const,
          message: 'Missing framework code',
        }))
      );
      setTimeout(() => {
        setModalOpen(false);
        setBatchStatus(
          pendingTerms.map((term) => ({
            name: term.name,
            code: term.code,
            description: term.description,
            label: term.label,
            categoryCode: term.categoryCode,
            status: 'failed' as const,
            message: 'Missing framework code',
          }))
        );
        setPendingTerms([]);
      }, 1200);
      return;
    }
    const results = await batchCreateTerms(pendingTerms, frameworkCode);
    // Update store for successful terms
    results.forEach((res, i) => {
      setCurrentModalIndex(i);
      if (res.status === 'success') {
        const categoryIndex = categories.findIndex(
          (cat) => cat.code === res.term.categoryCode
        );
        if (categoryIndex !== -1) {
          const newTerm = {
            identifier: res.term.code,
            name: res.term.name,
            code: res.term.code,
            description: res.term.description,
            status: 'Live',
            label: res.term.label,
          };
          const updatedCategories = [...categories];
          updatedCategories[categoryIndex].terms ??= [];
          updatedCategories[categoryIndex].terms.push(newTerm);
          setCategories(updatedCategories);
        }
      }
    });
    setTimeout(() => {
      setModalOpen(false);
      setBatchStatus(
        results.map((res) => ({
          name: res.term.name,
          code: res.term.code,
          description: res.term.description,
          label: res.term.label,
          categoryCode: res.term.categoryCode,
          status: res.status,
          message: res.message,
        }))
      );
      setPendingTerms([]);
    }, 1200);
  };

  const hasUnsavedTerms = () => pendingTerms.length > 0;

  return {
    form,
    setForm,
    error,
    setError,
    success,
    setSuccess,
    pendingTerms,
    setPendingTerms,
    batchStatus,
    setBatchStatus,
    modalOpen,
    setModalOpen,
    modalStatuses,
    setModalStatuses,
    currentModalIndex,
    setCurrentModalIndex,
    handleFormChange: handleTermFormChange,
    handleAddTerm,
    handleBatchCreate,
    handleRetry,
    hasUnsavedTerms,
  };
}

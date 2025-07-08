import { useState, useMemo } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import { batchCreateTermAssociations } from '@/services/associationService';
import type { Term } from '@/interfaces/TermInterface';
import type { Category } from '@/interfaces/CategoryInterface';
import type {
  Association,
  WorkingAssociation,
  CheckedTermCodesMap,
  AssociationModalData,
} from '@/interfaces/AssociationInterface';
import type { BatchAssociationCreateInput } from '@/services/associationService';

// Add new type for per-request result
export interface BatchRequestResult {
  input: BatchAssociationCreateInput;
  result?: unknown;
  error?: Error;
}

export const useStepAssociation = () => {
  const { categories, updateTermAssociations, framework } =
    useFrameworkFormStore();

  // Memoize categories with terms
  const categoriesWithTerms = useMemo(
    () => categories.filter((cat) => (cat.terms?.length ?? 0) > 0),
    [categories]
  );

  // State for selected source category and term
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>(
    categoriesWithTerms[0]?.code || ''
  );
  const selectedCategory = useMemo(
    () => categoriesWithTerms.find((cat) => cat.code === selectedCategoryCode),
    [categoriesWithTerms, selectedCategoryCode]
  );
  const [selectedTermCode, setSelectedTermCode] = useState<string>(
    selectedCategory?.terms?.[0]?.code ?? ''
  );
  const selectedTerm = useMemo(
    () => selectedCategory?.terms?.find((t) => t.code === selectedTermCode),
    [selectedCategory, selectedTermCode]
  );

  // Available categories (excluding selected source category)
  const availableCategories = useMemo(
    () =>
      categoriesWithTerms.filter((cat) => cat.code !== selectedCategoryCode),
    [categoriesWithTerms, selectedCategoryCode]
  );
  const [selectedAvailableCategoryCode, setSelectedAvailableCategoryCode] =
    useState<string>(availableCategories[0]?.code ?? '');
  const selectedAvailableCategory = useMemo(
    () =>
      availableCategories.find(
        (cat) => cat.code === selectedAvailableCategoryCode
      ),
    [availableCategories, selectedAvailableCategoryCode]
  );

  // Terms in selected available category
  const termsInAvailableCategory = selectedAvailableCategory?.terms ?? [];

  // State for all working associations across all terms
  const [workingAssociationsList, setWorkingAssociationsList] = useState<
    WorkingAssociation[]
  >([]);

  // State for checked terms (codes) per available category
  const [checkedTermCodesMap, setCheckedTermCodesMap] =
    useState<CheckedTermCodesMap>({});
  const checkedTermCodes =
    checkedTermCodesMap[selectedAvailableCategoryCode] ?? [];

  // Batch save state
  const [batchLoading, setBatchLoading] = useState(false);
  // State for batch results (per-request)
  const [batchResults, setBatchResults] = useState<BatchRequestResult[] | null>(
    null
  );

  // Association details modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<AssociationModalData>({
    term: null,
    assocCategory: undefined,
    assocTerms: [],
  });

  // Gather all terms with associations for the existing associations view
  const allTermsWithAssociations = useMemo(
    () =>
      categoriesWithTerms
        .flatMap((cat) =>
          (cat.terms || []).map((term) => ({
            ...term,
            categoryName: cat.name,
            categoryCode: cat.code,
            category: cat.code,
          }))
        )
        .filter(
          (term) =>
            Array.isArray(term.associations) && term.associations.length > 0
        ),
    [categoriesWithTerms]
  );

  // When category changes, reset term and available category
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const newCatCode = e.target.value as string;
    setSelectedCategoryCode(newCatCode);
    const newCat = categoriesWithTerms.find((cat) => cat.code === newCatCode);
    const newTermCode = newCat?.terms?.[0]?.code ?? '';
    setSelectedTermCode(newTermCode);

    // Pick first available category that's not the selected one
    const firstAvailable =
      categoriesWithTerms.find((c) => c.code !== newCatCode)?.code ?? '';
    setSelectedAvailableCategoryCode(firstAvailable);
  };

  // When term changes, initialize checkedTermCodesMap for all available categories
  const handleTermChange = (e: SelectChangeEvent<string>) => {
    const newTermCode = e.target.value as string;
    setSelectedTermCode(newTermCode);

    // Find the new selected term
    const newTerm = selectedCategory?.terms?.find(
      (t) => t.code === newTermCode
    );

    // Only load existing associations if there are no current working associations
    const hasCurrentAssociations = Object.values(checkedTermCodesMap).some(
      (codes) => codes.length > 0
    );

    if (newTerm && !hasCurrentAssociations) {
      // Load existing associations from database only if no current work exists
      const newMap: CheckedTermCodesMap = {};
      availableCategories.forEach((cat) => {
        newMap[cat.code] = (newTerm.associations || [])
          .filter((a) => a.category === cat.code)
          .map((a) => a.code);
      });
      setCheckedTermCodesMap(newMap);
    }
  };

  // When available category changes, do NOT clear checked terms
  const handleAvailableCategoryClick = (code: string) => {
    setSelectedAvailableCategoryCode(code);
  };

  // Toggle checked terms for the current available category
  const handleToggleTerm = (termCode: string) => {
    setCheckedTermCodesMap((prev) => {
      const prevChecked = prev[selectedAvailableCategoryCode] || [];
      return {
        ...prev,
        [selectedAvailableCategoryCode]: prevChecked.includes(termCode)
          ? prevChecked.filter((code) => code !== termCode)
          : [...prevChecked, termCode],
      };
    });
  };

  // Save associations for the selected term to working list (for preview)
  const handleSaveAssociations = () => {
    if (!selectedCategory || !selectedTerm) return;

    // Build associations from current checked terms
    const associations: Association[] = [];

    Object.entries(checkedTermCodesMap).forEach(
      ([targetCategoryCode, checkedCodes]) => {
        if (checkedCodes.length === 0) return;

        const targetCategory = categoriesWithTerms.find(
          (cat) => cat.code === targetCategoryCode
        );
        if (!targetCategory) return;

        // Get the checked terms from this category
        const checkedTerms = (targetCategory.terms || []).filter((term) =>
          checkedCodes.includes(term.code)
        );

        // Add associations for each checked term
        checkedTerms.forEach((checkedTerm) => {
          associations.push({
            name: checkedTerm.name,
            identifier: checkedTerm.identifier,
            description: checkedTerm.description,
            code: checkedTerm.code,
            status: checkedTerm.status,
            category: targetCategoryCode,
            index: checkedTerm.index,
          });
        });
      }
    );

    if (associations.length > 0) {
      setWorkingAssociationsList((prev) => {
        // Find if a working association for this term/category already exists
        const existing = prev.find(
          (wt) =>
            wt.code === selectedTerm.code &&
            wt.categoryCode === selectedCategory.code
        );
        if (existing) {
          // Merge associations, deduplicate by code+category
          const existingAssocs = Array.isArray(existing.associations)
            ? existing.associations
            : [];
          const merged = [
            ...existingAssocs,
            ...associations.filter(
              (a) =>
                !existingAssocs.some(
                  (ea) => ea.code === a.code && ea.category === a.category
                )
            ),
          ];
          return [
            ...prev.map((wt) =>
              wt.code === selectedTerm.code &&
              wt.categoryCode === selectedCategory.code
                ? { ...wt, associations: merged }
                : wt
            ),
          ];
        } else {
          // Add as new
          const workingTerm: WorkingAssociation = {
            ...selectedTerm,
            categoryCode: selectedCategory.code,
            categoryName: selectedCategory.name,
            category: selectedCategory.code,
            associations,
          };
          return [...prev, workingTerm];
        }
      });
      // Clear the checked terms for this term only after adding to working list
      setCheckedTermCodesMap({});
    }
  };

  // Unified save handler - creates working associations from checked terms and saves all to backend
  const handleBatchSaveAssociations = async () => {
    if (!framework?.code) return;

    setBatchLoading(true);
    setBatchResults(null);

    // Start with existing working associations
    let allWorkingAssociations = [...workingAssociationsList];

    // Add associations from currently checked terms if we have any
    const hasCheckedTerms = Object.values(checkedTermCodesMap).some(
      (codes) => codes.length > 0
    );
    if (selectedCategory && selectedTerm && hasCheckedTerms) {
      // Build associations from current checked terms
      const associations: Association[] = [];

      Object.entries(checkedTermCodesMap).forEach(
        ([targetCategoryCode, checkedCodes]) => {
          if (checkedCodes.length === 0) return;

          const targetCategory = categoriesWithTerms.find(
            (cat) => cat.code === targetCategoryCode
          );
          if (!targetCategory) return;

          // Get the checked terms from this category
          const checkedTerms = (targetCategory.terms || []).filter((term) =>
            checkedCodes.includes(term.code)
          );

          // Add associations for each checked term
          checkedTerms.forEach((checkedTerm) => {
            associations.push({
              name: checkedTerm.name,
              identifier: checkedTerm.identifier,
              description: checkedTerm.description,
              code: checkedTerm.code,
              status: checkedTerm.status,
              category: targetCategoryCode,
              index: checkedTerm.index,
            });
          });
        }
      );

      if (associations.length > 0) {
        // Create working term for the currently selected term
        const workingTerm: WorkingAssociation = {
          ...selectedTerm,
          categoryCode: selectedCategory.code,
          categoryName: selectedCategory.name,
          category: selectedCategory.code,
          associations,
        };

        // Remove any existing entry for this term and add the new one
        allWorkingAssociations = [
          ...allWorkingAssociations.filter(
            (wt) =>
              !(
                wt.code === selectedTerm.code &&
                wt.categoryCode === selectedCategory.code
              )
          ),
          workingTerm,
        ];
      }
    }

    // If no associations to save, exit
    if (allWorkingAssociations.length === 0) {
      setBatchLoading(false);
      return;
    }

    // Build batch payload from all working associations
    const updates = allWorkingAssociations.map((workingTerm) => ({
      fromTermCode: workingTerm.code,
      frameworkCode: framework.code!,
      categoryCode: workingTerm.categoryCode,
      associations: (workingTerm.associations || []).map((a) => ({
        identifier: a.identifier,
      })),
    }));

    try {
      const results = await batchCreateTermAssociations(updates);
      setBatchResults(results);

      // If successful, update the store and clear working associations
      if (results.length > 0) {
        // Update each term in the store
        allWorkingAssociations.forEach((workingTerm) => {
          const categoryIndex = categories.findIndex(
            (cat) => cat.code === workingTerm.categoryCode
          );
          const termIndex =
            categories[categoryIndex]?.terms?.findIndex(
              (t) => t.code === workingTerm.code
            ) ?? -1;
          if (categoryIndex !== -1 && termIndex !== -1) {
            updateTermAssociations(
              categoryIndex,
              termIndex,
              workingTerm.associations || []
            );
          }
        });

        // Clear working associations and checked terms
        setWorkingAssociationsList([]);
        setCheckedTermCodesMap({});
      }
    } catch {
      setBatchResults(
        updates.map((input) => ({
          input,
          error: new Error('Batch request failed'),
        }))
      );
    } finally {
      setBatchLoading(false);
    }
  };

  // Retry handler for failed requests
  const handleRetryBatchRequests = async (
    failedInputs: BatchAssociationCreateInput[]
  ) => {
    setBatchLoading(true);
    try {
      const results = await batchCreateTermAssociations(failedInputs);
      setBatchResults((prev) => {
        if (!prev) return results;
        // Merge new results with previous, replacing retried ones
        const prevMap = new Map(prev.map((r) => [JSON.stringify(r.input), r]));
        for (const r of results) {
          prevMap.set(JSON.stringify(r.input), r);
        }
        return Array.from(prevMap.values());
      });
    } finally {
      setBatchLoading(false);
    }
  };

  // Clear all associations
  const handleClearAllAssociations = () => {
    setCheckedTermCodesMap({});
    setWorkingAssociationsList([]);
  };

  // Modal handlers
  const handleChipClick = (
    term: Term,
    assocCategory: Category | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _assocTerms: Association[]
  ) => {
    // Filter associations for the specific clicked category
    const categoryAssociations = (term.associations || []).filter(
      (assoc) => assoc.category === assocCategory?.code
    );

    setModalData({
      term,
      assocCategory,
      assocTerms: categoryAssociations,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Check if there are unsaved associations
  const hasUnsavedAssociations = () => {
    return (
      Object.values(checkedTermCodesMap).some((codes) => codes.length > 0) ||
      workingAssociationsList.length > 0
    );
  };

  return {
    // Data
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
    handleRetryBatchRequests,
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

    // Utilities
    hasUnsavedAssociations,

    // Modal
    setModalOpen,
    setModalData,
    handleChipClick,
    handleCloseModal,

    // Add setter for working associations
    setWorkingAssociationsList,
  };
};

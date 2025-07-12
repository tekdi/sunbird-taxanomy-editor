import type { Category } from '@/interfaces/CategoryInterface';
import type { Term } from '@/interfaces/TermInterface';

export interface Association {
  name: string;
  identifier: string;
  description?: string;
  code: string;
  status: string;
  category: string;
  index?: number;
}

// Working association item that includes category information
export interface WorkingAssociation extends Term {
  categoryCode: string;
  categoryName: string;
  category: string;
}

// Checked terms map for tracking selected associations
export interface CheckedTermCodesMap {
  [categoryCode: string]: string[];
}

// Modal data for association details
export interface AssociationModalData {
  term: Term | null;
  assocCategory: Category | undefined;
  assocTerms: Association[];
}

// Batch save result
export interface BatchSaveResult {
  success: number;
  failed: number;
}

// Step Association Handle for parent component
export interface StepAssociationHandle {
  hasUnsavedAssociations: () => boolean;
  clearWorkingAssociations: () => void;
}

export interface AssociationCategoriesProps {
  categories: Category[];
  termName: string;
  categoryName: string;
  onBadgeClick: (
    categories: Category[],
    termName: string,
    categoryName: string,
    clickedCategoryId?: string
  ) => void;
}

export interface AssociationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  termName: string;
  categoryName: string;
  expandedCategory: string | null;
  onCategoryClick: (id: string) => void;
}

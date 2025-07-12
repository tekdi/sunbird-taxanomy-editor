import { Term } from './TermInterface';
import type { Association } from './AssociationInterface';

export interface Category {
  identifier: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  terms?: Term[];
  index?: number;
}

export type FormChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | { target: { name: string; value: string } };

export interface CategoryFormProps {
  form: {
    name: string;
    code: string;
    description: string;
  };
  onChange: (e: FormChangeEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  success?: string | null;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export interface PendingCategoriesSectionProps {
  pendingCategories: {
    name: string;
    code: string;
    description: string;
  }[];
  getItemDetails: (item: Record<string, unknown>) => React.ReactNode;
  onCreate: () => void;
}

export interface StepCategoryHandle {
  hasUnsavedCategories: () => boolean;
}

export interface CategoryCardProps {
  category: Category;
  groupAssociationsByCategory: (associations: Association[]) => Category[];
  getLiveTerms: (category: Category) => Term[];
  grey: Record<string, string>;
  onBadgeClick: (
    categories: Category[],
    termName: string,
    categoryName: string,
    clickedCategoryId?: string
  ) => void;
}

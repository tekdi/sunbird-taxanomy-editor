import type { Category } from '@/interfaces/CategoryInterface';

export interface Association {
  name: string;
  identifier: string;
  description?: string;
  code: string;
  status: string;
  category: string;
  index?: number;
}

export interface AssociationCategoriesProps {
  categories: Category[];
  termName: string;
  categoryName: string;
  onBadgeClick: (
    categories: Category[],
    termName: string,
    categoryName: string
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

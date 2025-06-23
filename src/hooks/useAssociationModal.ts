import { useState } from 'react';
import { Category } from '@/types/CategoryInterface';

export function useAssociationModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategories, setModalCategories] = useState<Category[]>([]);
  const [modalTermName, setModalTermName] = useState('');
  const [modalCategoryName, setModalCategoryName] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleBadgeClick = (
    categories: Category[],
    termName: string,
    categoryName: string
  ) => {
    setModalCategories(categories);
    setModalTermName(termName);
    setModalCategoryName(categoryName);
    setModalOpen(true);
    setExpandedCategory(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setExpandedCategory(null);
  };

  return {
    handleBadgeClick,
    modalProps: {
      open: modalOpen,
      onClose: handleModalClose,
      categories: modalCategories,
      termName: modalTermName,
      categoryName: modalCategoryName,
      expandedCategory,
      onCategoryClick: setExpandedCategory,
    },
  };
}

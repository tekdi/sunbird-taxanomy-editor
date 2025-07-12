// This file contains a custom hook for managing the state of an association modal.
// It provides functions to open the modal with specific categories and terms, and to close the modal
// when needed.

import { useState } from 'react';
import { Category } from '@/interfaces/CategoryInterface';

export function useAssociationModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategories, setModalCategories] = useState<Category[]>([]);
  const [modalTermName, setModalTermName] = useState('');
  const [modalCategoryName, setModalCategoryName] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  /**
   * Handles the click event on a badge to open the modal with specific categories and term details.
   *
   * @param {Category[]} categories - The categories associated with the term.
   * @param {string} termName - The name of the term.
   * @param {string} categoryName - The name of the category.
   * @param {string} clickedCategoryId - The identifier of the category that was clicked (optional).
   * @returns {void}
   **/
  const handleBadgeClick = (
    categories: Category[],
    termName: string,
    categoryName: string,
    clickedCategoryId?: string
  ) => {
    setModalCategories(categories);
    setModalTermName(termName);
    setModalCategoryName(categoryName);
    setModalOpen(true);
    // Automatically expand the clicked category if provided
    setExpandedCategory(clickedCategoryId || null);
  };

  /**
   * Handles the closing of the modal.
   * Resets the expanded category and closes the modal.
   *
   * @returns {void}
   **/
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

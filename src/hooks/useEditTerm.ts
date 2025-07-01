import { useState } from 'react';
import { updateTerm } from '@/services/termService';
import { Category } from '@/interfaces/CategoryInterface';
import { Framework } from '@/interfaces/FrameworkInterface';
import { Channel } from '@/interfaces/ChannelInterface';

interface EditTerm {
  identifier: string;
  code: string;
  categoryCode: string;
}

interface FormState {
  name: string;
  code: string;
  description: string;
  label: string;
  selectedCategory: string;
}

export function useEditTerm({
  categories,
  setCategories,
  framework,
  channel,
  form,
  setForm,
  setError,
  setSuccess,
}: {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  framework: Partial<Framework> | null;
  channel: Channel | null;
  form: FormState;
  setForm: (form: FormState) => void;
  setError: (err: string | null) => void;
  setSuccess: (msg: string | null) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTerm, setEditingTerm] = useState<EditTerm | null>(null);

  // Load term details into form for editing
  const handleEditTerm = (term: Record<string, unknown>) => {
    setForm({
      name: String(term.name ?? ''),
      code: String(term.code ?? ''),
      description: String(term.description ?? ''),
      label: String(term.label ?? term.name ?? ''),
      selectedCategory: String(term.categoryCode ?? ''),
    });
    setEditingTerm({
      identifier: String(term.identifier ?? ''),
      code: String(term.code ?? ''),
      categoryCode: String(term.categoryCode ?? ''),
    });
    setIsEditMode(true);
    setError(null);
    setSuccess(null);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingTerm(null);
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

  // Update existing term
  const handleUpdateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTerm) return;
    try {
      const frameworkCode = framework?.code;
      const channelId = channel?.identifier;
      if (!frameworkCode || !channelId)
        throw new Error('Missing framework or channel');
      await updateTerm(
        {
          identifier: editingTerm.identifier,
          code: editingTerm.code,
          categoryCode: editingTerm.categoryCode,
          description: form.description,
          label: form.label,
        },
        frameworkCode,
        channelId
      );
      // Update term in the store
      const categoryIndex = categories.findIndex(
        (cat) => cat.code === editingTerm.categoryCode
      );
      if (categoryIndex !== -1) {
        const updatedCategories = [...categories];
        const termIndex = updatedCategories[categoryIndex].terms?.findIndex(
          (term) => term.identifier === editingTerm.identifier
        );
        if (termIndex !== undefined && termIndex !== -1) {
          updatedCategories[categoryIndex].terms![termIndex] = {
            ...updatedCategories[categoryIndex].terms![termIndex],
            description: form.description,
            label: form.label,
          };
          setCategories(updatedCategories);
        }
      }
      setSuccess('Term updated successfully');
      setIsEditMode(false);
      setEditingTerm(null);
      setForm({
        name: '',
        code: '',
        description: '',
        label: '',
        selectedCategory: '',
      });
    } catch (err: unknown) {
      let msg = 'Failed to update term';
      if (err instanceof Error) msg = err.message;
      setError(msg);
    }
  };

  return {
    isEditMode,
    editingTerm,
    handleEditTerm,
    handleCancelEdit,
    handleUpdateTerm,
  };
}

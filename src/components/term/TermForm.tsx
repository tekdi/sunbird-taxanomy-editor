import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EntityFormFields from '@/components/framework/EntityFormFields';
import AlertMessage from '@/components/framework/AlertMessage';

interface TermFormProps {
  form: {
    name: string;
    code: string;
    description: string;
    label: string;
    selectedCategory: string;
  };
  categories: { code: string; name: string }[];
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<{ value: unknown }>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  success?: string | null;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const TermForm: React.FC<TermFormProps> = ({
  form,
  categories,
  onChange,
  onSubmit,
  error,
  success,
  isEditMode = false,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <EntityFormFields
        title={isEditMode ? 'Edit Term' : 'Add New Term'}
        fields={[
          {
            label: 'Category',
            name: 'selectedCategory',
            value: form.selectedCategory,
            onChange: (e) => onChange(e as React.ChangeEvent<HTMLInputElement>),
            required: true,
            size: 'small',
            sx: { flex: 1, minWidth: 180 },
            disabled: isEditMode,
            type: 'select',
            options: categories.map((category) => ({
              value: category.code,
              label: category.name,
            })),
          },
          {
            label: 'Name',
            name: 'name',
            value: form.name,
            onChange: (e) => onChange(e as React.ChangeEvent<HTMLInputElement>),
            required: true,
            size: 'small',
            sx: { flex: 1, minWidth: 180 },
            disabled: isEditMode,
          },
          {
            label: 'Code',
            name: 'code',
            value: form.code,
            onChange: (e) => onChange(e as React.ChangeEvent<HTMLInputElement>),
            required: true,
            size: 'small',
            sx: { flex: 1, minWidth: 180 },
            disabled: isEditMode,
          },
          {
            label: 'Label',
            name: 'label',
            value: form.label,
            onChange: (e) => onChange(e as React.ChangeEvent<HTMLInputElement>),
            required: true,
            size: 'small',
            sx: { flex: 1, minWidth: 180 },
          },
        ]}
      >
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={onChange}
              size="small"
              fullWidth
              multiline
              minRows={2}
              sx={{ flex: 2, minWidth: 220 }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                width: '100%',
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ minWidth: 180 }}
              >
                {isEditMode ? 'Update Term' : 'Add Term'}
              </Button>
              {isEditMode && onCancel && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <AlertMessage severity="error" message={error || ''} sx={{ mt: 2 }} />
        <AlertMessage
          severity="success"
          message={success || ''}
          sx={{ mt: 2 }}
        />
      </EntityFormFields>
    </form>
  );
};

export default TermForm;

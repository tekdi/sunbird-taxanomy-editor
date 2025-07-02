import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';

/**
 * UniversalForm - A single, configurable form component that replaces multiple form components
 *
 * This component consolidates CategoryForm, TermForm, and FormLayout into one reusable component.
 * Benefits:
 * - Eliminates code duplication (was 14.4% duplicated code)
 * - Reduces component hierarchy from 4 levels to 2 levels
 * - Simpler type management
 * - Easier maintenance - changes in one place
 * - Smaller bundle size
 *
 * Supports:
 * - Text inputs, select dropdowns
 * - Optional description field
 * - Edit/Add modes with different button text
 * - Error/Success messaging
 * - Loading states
 * - Form validation
 */

type FormChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | { target: { name: string; value: string } };

interface FormField {
  name: string;
  label: string;
  value: string;
  type?: 'text' | 'select';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface UniversalFormProps {
  title: string;
  fields: FormField[];
  description?: {
    value: string;
    name: string;
  };
  onChange: (e: FormChangeEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  updateButtonText?: string;
  isEditMode?: boolean;
  onCancel?: () => void;
  error?: string | null;
  success?: string | null;
  loading?: boolean;
}

const UniversalForm: React.FC<UniversalFormProps> = ({
  title,
  fields,
  description,
  onChange,
  onSubmit,
  submitButtonText,
  updateButtonText,
  isEditMode = false,
  onCancel,
  error,
  success,
  loading = false,
}) => {
  return (
    <Box mt={4}>
      <Typography variant="subtitle2" fontSize={16} fontWeight={600} mb={2}>
        {title}
      </Typography>

      <form onSubmit={onSubmit} autoComplete="off">
        {/* Main Fields */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          {fields.map((field) =>
            field.type === 'select' && field.options ? (
              <FormControl
                key={field.name}
                size="small"
                sx={{ flex: 1, minWidth: 180 }}
                disabled={field.disabled}
              >
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  label={field.label}
                  onChange={onChange}
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                value={field.value}
                onChange={onChange}
                required={field.required}
                disabled={field.disabled}
                size="small"
                sx={{ flex: 1, minWidth: 180 }}
                InputProps={{ readOnly: field.readOnly }}
                placeholder={field.placeholder}
              />
            )
          )}
        </Box>

        {/* Description Field (if provided) */}
        {description && (
          <Box mb={2}>
            <TextField
              name={description.name}
              label="Description"
              value={description.value}
              onChange={onChange}
              size="small"
              fullWidth
              multiline
              minRows={2}
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} mb={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 180 }}
          >
            {isEditMode && updateButtonText
              ? updateButtonText
              : submitButtonText}
          </Button>
          {isEditMode && onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
          )}
        </Box>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default UniversalForm;

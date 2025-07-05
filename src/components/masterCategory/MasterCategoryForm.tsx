import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { MasterCategoryFormProps } from '@/interfaces/MasterCategoryInterface';

// This component renders a form for creating a master category.
// It includes fields for name, code, target ID field name, search label field name, search ID field name, org ID field name, and description.
// The form includes validation for required fields and displays appropriate messages for errors and success.
// It also handles loading state during submission.
const MasterCategoryForm: React.FC<MasterCategoryFormProps> = ({
  form,
  onChange,
  onSubmit,
  loading,
  error,
  success,
}) => (
  <form onSubmit={onSubmit} autoComplete="off">
    <Box display="flex" flexWrap="wrap" gap={2}>
      <TextField
        label="Name"
        name="name"
        value={form.name}
        onChange={onChange}
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
      <TextField
        label="Code"
        name="code"
        value={form.code}
        onChange={onChange}
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
      <TextField
        label="Target ID Field Name"
        name="targetIdFieldName"
        value={form.targetIdFieldName}
        InputProps={{ readOnly: true }}
        disabled
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
    </Box>
    <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
      <TextField
        label="Search Label Field Name"
        name="searchLabelFieldName"
        value={form.searchLabelFieldName}
        InputProps={{ readOnly: true }}
        disabled
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
      <TextField
        label="Search ID Field Name"
        name="searchIdFieldName"
        value={form.searchIdFieldName}
        InputProps={{ readOnly: true }}
        disabled
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
      <TextField
        label="Org ID Field Name"
        name="orgIdFieldName"
        value={form.orgIdFieldName}
        InputProps={{ readOnly: true }}
        disabled
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
    </Box>
    <Box mt={2}>
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={onChange}
        size="small"
        fullWidth
        multiline
        minRows={2}
      />
    </Box>
    {error && (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )}
    {success && (
      <Alert severity="success" sx={{ mt: 2 }}>
        {success}
      </Alert>
    )}
    <Button
      type="submit"
      variant="contained"
      color="primary"
      sx={{ mt: 2, minWidth: 180 }}
      disabled={loading}
    >
      {loading ? 'Creating...' : 'Create Master Category'}
    </Button>
  </form>
);

export default MasterCategoryForm;

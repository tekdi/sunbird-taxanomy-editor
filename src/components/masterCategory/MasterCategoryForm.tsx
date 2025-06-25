import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

interface MasterCategoryFormProps {
  form: {
    name: string;
    code: string;
    description: string;
    targetIdFieldName: string;
    searchLabelFieldName: string;
    searchIdFieldName: string;
    orgIdFieldName: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
}

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
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
      <TextField
        label="Search ID Field Name"
        name="searchIdFieldName"
        value={form.searchIdFieldName}
        InputProps={{ readOnly: true }}
        required
        size="small"
        sx={{ flex: 1, minWidth: 180 }}
      />
      <TextField
        label="Org ID Field Name"
        name="orgIdFieldName"
        value={form.orgIdFieldName}
        InputProps={{ readOnly: true }}
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

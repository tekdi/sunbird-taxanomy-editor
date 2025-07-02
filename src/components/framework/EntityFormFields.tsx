import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface EntityFormField {
  label: string;
  name: string;
  value: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<{ value: unknown }>
      | SelectChangeEvent<string>
  ) => void;
  required?: boolean;
  size?: 'small' | 'medium';
  sx?: object;
  disabled?: boolean;
  multiline?: boolean;
  minRows?: number;
  type?: 'text' | 'select';
  options?: Array<{ value: string; label: string }>;
}

interface EntityFormFieldsProps {
  title: string;
  fields: EntityFormField[];
  children?: React.ReactNode;
  gap?: number;
  mb?: number;
}

const EntityFormFields: React.FC<EntityFormFieldsProps> = ({
  title,
  fields,
  children,
  gap = 2,
  mb = 2,
}) => {
  if (!fields.length) return null;
  return (
    <Box mt={4}>
      <Typography variant="subtitle2" fontSize={16} fontWeight={600} mb={2}>
        {title}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={gap} mb={mb}>
        {fields.map((field) =>
          field.type === 'select' && field.options ? (
            <FormControl
              size={field.size || 'small'}
              sx={field.sx || { flex: 1, minWidth: 180 }}
              key={field.name}
            >
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={field.value}
                label={field.label}
                onChange={field.onChange}
                required={field.required}
                disabled={field.disabled}
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
              label={field.label}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              size={field.size || 'small'}
              sx={field.sx || { flex: 1, minWidth: 180 }}
              disabled={field.disabled}
              multiline={field.multiline}
              minRows={field.minRows}
            />
          )
        )}
        {children}
      </Box>
    </Box>
  );
};

export default EntityFormFields;

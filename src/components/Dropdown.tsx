import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DropdownProps } from '@/interfaces/BaseInterface';

const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  helperText,
  ...selectProps
}) => (
  <Box mb={2}>
    <Typography
      variant="caption"
      fontWeight={400}
      mb={0.5}
      color="text.secondary"
    >
      {label} {required ? '*' : ''}
    </Typography>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
      fullWidth
      required={required}
      disabled={disabled}
      sx={{ mb: 0.5, borderRadius: 2, background: '#fff', minHeight: 56 }}
      MenuProps={{
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
        PaperProps: {
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            p: 0.5,
            minWidth: 300,
          },
        },
      }}
      inputProps={{ 'aria-label': label }}
      {...selectProps}
    >
      <MenuItem value="" disabled sx={{ color: '#888' }}>
        {label}
      </MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} sx={{ px: 2, py: 1.2 }}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
    {helperText && (
      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
        {helperText}
      </Typography>
    )}
  </Box>
);

export default Dropdown;

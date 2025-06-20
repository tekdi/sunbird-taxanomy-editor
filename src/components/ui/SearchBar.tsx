import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { SxProps } from "@mui/material/styles";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  sx?: SxProps;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  autoFocus = false,
  sx = {},
}) => (
  <TextField
    type="search"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: "#6366f1" }} />
        </InputAdornment>
      ),
    }}
    sx={{ flex: 1, minWidth: 240, bgcolor: "#fff", ...sx }}
    autoFocus={autoFocus}
  />
);

export default SearchBar;

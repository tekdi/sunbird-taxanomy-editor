import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { blue } from '@mui/material/colors';
import { Category } from '@/interfaces/CategoryInterface';

interface AssociationCategoriesProps {
  categories: Category[];
  termName: string;
  categoryName: string;
  onBadgeClick: (
    categories: Category[],
    termName: string,
    categoryName: string
  ) => void;
}

const AssociationCategories: React.FC<AssociationCategoriesProps> = ({
  categories,
  termName,
  categoryName,
  onBadgeClick,
}) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {categories.slice(0, 4).map((cat) => (
      <Button
        key={cat.identifier}
        variant="text"
        size="small"
        sx={{
          minWidth: 0,
          p: 0,
          lineHeight: 1,
          borderRadius: 2,
          textTransform: 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
        aria-label={`Show associations for ${cat.name}`}
      >
        <Chip
          label={cat.name}
          size="small"
          onClick={() => onBadgeClick(categories, termName, categoryName)}
          sx={{
            bgcolor: blue[100],
            color: blue[800],
            fontWeight: 500,
            mr: 0.5,
          }}
        />
      </Button>
    ))}
    {categories.length > 4 && (
      <Button
        size="small"
        variant="outlined"
        sx={{ ml: 1, px: 2, py: 0.5, fontSize: 12 }}
        onClick={() => onBadgeClick(categories, termName, categoryName)}
      >
        Show More
      </Button>
    )}
  </Box>
);

export default AssociationCategories;

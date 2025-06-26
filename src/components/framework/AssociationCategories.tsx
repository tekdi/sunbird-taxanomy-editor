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

// This component renders a list of association categories as badges.
// It accepts an array of categories, a term name, a category name, and a callback function to handle badge clicks.
// The badges are displayed in a flex container, and if there are more than four categories,
// a "Show More" button is displayed to allow users to view additional categories.
// Each badge is clickable and triggers the provided callback function with the relevant parameters.
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

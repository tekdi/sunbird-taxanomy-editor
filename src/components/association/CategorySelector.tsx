import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import type { Category } from '@/interfaces/CategoryInterface';

interface CategorySelectorProps {
  availableCategories: Category[];
  selectedAvailableCategoryCode: string;
  onCategoryClick: (code: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  availableCategories,
  selectedAvailableCategoryCode,
  onCategoryClick,
}) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Available Categories
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {availableCategories.map((cat) => (
            <Button
              key={cat.code}
              onClick={() => onCategoryClick(cat.code)}
              variant={
                selectedAvailableCategoryCode === cat.code
                  ? 'contained'
                  : 'outlined'
              }
              color={
                selectedAvailableCategoryCode === cat.code
                  ? 'primary'
                  : 'inherit'
              }
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                background:
                  selectedAvailableCategoryCode === cat.code
                    ? '#f5f7ff'
                    : undefined,
                color:
                  selectedAvailableCategoryCode === cat.code
                    ? '#5b47fa'
                    : undefined,
              }}
            >
              {cat.name}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategorySelector;

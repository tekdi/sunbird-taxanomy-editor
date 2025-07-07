import React from 'react';
import { Card, CardContent, Typography, Checkbox, Box } from '@mui/material';
import type { Category } from '@/interfaces/CategoryInterface';
import type { Term } from '@/interfaces/TermInterface';

interface TermChecklistProps {
  selectedAvailableCategory: Category | undefined;
  termsInAvailableCategory: Term[];
  checkedTermCodes: string[];
  selectedTerm: Term | undefined;
  onToggleTerm: (termCode: string) => void;
}

const TermChecklist: React.FC<TermChecklistProps> = ({
  selectedAvailableCategory,
  termsInAvailableCategory,
  checkedTermCodes,
  selectedTerm,
  onToggleTerm,
}) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          {selectedAvailableCategory
            ? `Terms in ${selectedAvailableCategory.name}`
            : 'Select a Category'}
        </Typography>
        {selectedAvailableCategory && termsInAvailableCategory.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {termsInAvailableCategory.map((term) => (
              <Box
                key={term.code}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Checkbox
                  checked={checkedTermCodes.includes(term.code)}
                  onChange={() => onToggleTerm(term.code)}
                  disabled={!selectedTerm}
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {term.name}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {selectedAvailableCategory
              ? 'No terms available in this category'
              : 'Select a category to view terms'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TermChecklist;

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Term } from '@/interfaces/TermInterface';
import type { Category } from '@/interfaces/CategoryInterface';
import type { Association } from '@/interfaces/AssociationInterface';

interface AssociationTableProps {
  associations: (Term & { categoryCode?: string; categoryName?: string })[];
  categories: Category[];
  onChipClick: (
    term: Term,
    assocCategory: Category | undefined,
    assocTerms: Association[]
  ) => void;
  title?: string;
}

const AssociationTable: React.FC<AssociationTableProps> = ({
  associations,
  categories,
  onChipClick,
  title,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {title && (
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
        )}
        <IconButton
          size="small"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.04)',
            borderRadius: 1,
            transition: 'background 0.2s',
            ':hover': {
              backgroundColor: 'rgba(0,0,0,0.10)',
            },
          }}
        >
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>
      {!collapsed && (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 1 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Term</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Association</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {associations.map((term) => {
                // Group associations by category
                const grouped = (term.associations ?? []).reduce(
                  (acc, assoc) => {
                    if (!acc[assoc.category]) acc[assoc.category] = [];
                    acc[assoc.category].push(assoc);
                    return acc;
                  },
                  {} as Record<string, Association[]>
                );

                // Find the category name for the term's category code
                // Handle both term.category and term.categoryCode properties
                const termCategoryCode = term.category || term.categoryCode;
                const termCategory = categories.find(
                  (cat) => cat.code === termCategoryCode
                );

                return (
                  <TableRow key={term.identifier} hover>
                    <TableCell>
                      {termCategory
                        ? termCategory.name
                        : termCategoryCode || 'Unknown'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{term.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(grouped).map(([catCode, assocs]) => {
                          const assocCategory = categories.find(
                            (cat) => cat.code === catCode
                          );

                          return (
                            <Chip
                              key={catCode}
                              label={assocCategory?.name || catCode}
                              onClick={() =>
                                onChipClick(term, assocCategory, assocs)
                              }
                              sx={{
                                cursor: 'pointer',
                                fontWeight: 500,
                                boxShadow: 1,
                                ':hover': { boxShadow: 3 },
                                mb: 0.5,
                              }}
                              tabIndex={0}
                              aria-label={`Show associations for ${
                                assocCategory?.name || catCode
                              }`}
                            />
                          );
                        })}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AssociationTable;

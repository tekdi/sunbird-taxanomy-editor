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
  Checkbox,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  // New props for selection
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
  showSelection?: boolean;
  // New props for actions
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  onEdit?: (
    term: Term & { categoryCode?: string; categoryName?: string }
  ) => void;
  onDelete?: (
    term: Term & { categoryCode?: string; categoryName?: string }
  ) => void;
}

const AssociationTable: React.FC<AssociationTableProps> = ({
  associations,
  categories,
  onChipClick,
  title,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  showSelection = false,
  showEditAction = false,
  showDeleteAction = false,
  onEdit,
  onDelete,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const allSelected =
    associations.length > 0 &&
    associations.every((term) => selectedIds.includes(term.identifier));
  const someSelected =
    associations.some((term) => selectedIds.includes(term.identifier)) &&
    !allSelected;
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
                {showSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={someSelected}
                      checked={allSelected}
                      onChange={(e) =>
                        onSelectAll && onSelectAll(e.target.checked)
                      }
                      inputProps={{ 'aria-label': 'select all associations' }}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Term</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Association</TableCell>
                {(showEditAction || showDeleteAction) && (
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                )}
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
                    {showSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(term.identifier)}
                          onChange={() =>
                            onSelectRow && onSelectRow(term.identifier)
                          }
                          inputProps={{
                            'aria-label': `select association ${term.name}`,
                          }}
                        />
                      </TableCell>
                    )}
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
                    {(showEditAction || showDeleteAction) && (
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {showEditAction && (
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={() => onEdit && onEdit(term)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {showDeleteAction && (
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={() => onDelete && onDelete(term)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    )}
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

import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AssociationCategories from './AssociationCategories';
import type { CategoryCardProps } from '@/interfaces/CategoryInterface';

// This component renders a card for a specific category.
// It displays the category name, description, and a table of terms associated with that category.
// Each term shows its name, code, description, and associations.
// The associations are grouped by category and displayed as badges.
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  groupAssociationsByCategory,
  getLiveTerms,
  grey,
  onBadgeClick,
}) => (
  <Card sx={{ boxShadow: 2 }}>
    <CardHeader
      title={
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {category.name || 'Unnamed Category'}
          </Typography>
          {category.description && (
            <Typography color="text.secondary">
              {category.description}
            </Typography>
          )}
        </Box>
      }
      sx={{
        bgcolor: grey[50],
        borderBottom: 1,
        borderColor: 'divider',
      }}
    />
    <CardContent>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: grey[100] }}>
              <TableCell sx={{ fontWeight: 600 }}>Terms</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Associations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getLiveTerms(category).length > 0 ? (
              getLiveTerms(category).map((term) =>
                term ? (
                  <TableRow
                    key={term.identifier || term.name || Math.random()}
                    hover
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {term.name || 'Unnamed Term'}
                    </TableCell>
                    <TableCell>{term.code || '-'}</TableCell>
                    <TableCell>{term.description || '-'}</TableCell>
                    <TableCell>
                      {Array.isArray(term.associations) &&
                      term.associations.length > 0 ? (
                        (() => {
                          const liveAssocs = term.associations.filter(
                            (assoc) => assoc && assoc.status === 'Live'
                          );
                          if (liveAssocs.length === 0)
                            return (
                              <span style={{ color: grey[500] }}>
                                No associations
                              </span>
                            );
                          const categories =
                            groupAssociationsByCategory(liveAssocs);
                          return (
                            <AssociationCategories
                              categories={categories}
                              termName={term.name}
                              categoryName={category.name}
                              onBadgeClick={onBadgeClick}
                            />
                          );
                        })()
                      ) : (
                        <span style={{ color: grey[500] }}>
                          No associations
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ) : null
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ color: grey[500], py: 3 }}
                >
                  No terms available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

export default CategoryCard;

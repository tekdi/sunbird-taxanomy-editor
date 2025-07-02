import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import type { AssociationDetailsModalProps } from '@/interfaces/AssociationInterface';

// This component renders a modal displaying association details for a specific term and category.
// It includes a list of categories, each with an expandable section showing associated terms.
// The modal can be opened or closed, and it allows users to click on categories to expand or collapse their details.
// The modal header displays the term and category names, and the categories are displayed as buttons with an expandable icon indicating whether the category is expanded or collapsed.
// The categories are passed as props, along with the term and category names, and a callback function to handle category clicks. The expanded category state is also managed to control which category's terms are currently visible.
const AssociationDetailsModal: React.FC<AssociationDetailsModalProps> = ({
  open,
  onClose,
  categories,
  termName,
  categoryName,
  expandedCategory,
  onCategoryClick,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 350,
        maxWidth: '90vw',
        outline: 'none',
        maxHeight: '90vh',
        overflow: 'visible',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" component="div" color="text.primary">
          {termName && categoryName ? (
            <span>
              Association for Term{' '}
              <span style={{ fontWeight: 700, color: '#6366f1' }}>
                {termName}
              </span>{' '}
              of Category{' '}
              <span style={{ fontWeight: 700, color: '#6366f1' }}>
                {categoryName}
              </span>
            </span>
          ) : (
            'All Categories'
          )}
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: 0, p: 0, ml: 2 }}>
          ×
        </Button>
      </Box>
      <Box
        sx={{
          maxHeight: '60vh',
          overflowY: 'auto',
          pr: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {categories.map((cat) => (
          <Box key={cat.identifier} mb={2}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                textAlign: 'left',
                fontWeight: 600,
                bgcolor: '#f1f5f9',
                color: 'text.primary',
                mb: 1,
                justifyContent: 'space-between',
                '& .MuiButton-label': { color: 'text.primary' },
              }}
              endIcon={
                <span
                  style={{
                    display: 'inline-block',
                    transform:
                      expandedCategory === cat.identifier
                        ? 'rotate(90deg)'
                        : 'none',
                    transition: 'transform 0.2s',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="#4B5563"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              }
              onClick={() => onCategoryClick(cat.identifier)}
            >
              <span style={{ color: 'inherit', fontWeight: 700 }}>
                {cat.name}
              </span>
            </Button>
            {expandedCategory === cat.identifier && (
              <Box pl={3} py={1}>
                {cat.terms && cat.terms.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {cat.terms.map((term) => (
                      <li
                        key={term.identifier}
                        style={{
                          padding: '2px 0',
                          color: 'var(--mui-palette-text-primary, #1a1a1a)',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--mui-palette-text-primary, #1a1a1a)',
                          }}
                        >
                          {term.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No terms
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  </Modal>
);

export default AssociationDetailsModal;

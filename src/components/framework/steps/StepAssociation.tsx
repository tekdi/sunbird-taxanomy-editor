import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Grid,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import AssociationDetailsModal from '@/components/framework/AssociationDetailsModal';
import AssociationCategories from '@/components/framework/AssociationCategories';
import { useAssociationModal } from '@/hooks/useAssociationModal';

const StepAssociation: React.FC = () => {
  // Get categories from the store
  const { categories, updateTermAssociations } = useFrameworkFormStore();

  // Association modal state
  const { handleBadgeClick, modalProps } = useAssociationModal();

  // Memoize categories with terms
  const categoriesWithTerms = useMemo(
    () => categories.filter((cat) => (cat.terms?.length ?? 0) > 0),
    [categories]
  );

  // State for selected source category and term
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>(
    categoriesWithTerms[0]?.code || ''
  );
  const selectedCategory = useMemo(
    () => categoriesWithTerms.find((cat) => cat.code === selectedCategoryCode),
    [categoriesWithTerms, selectedCategoryCode]
  );
  const [selectedTermCode, setSelectedTermCode] = useState<string>(
    selectedCategory?.terms?.[0]?.code || ''
  );
  const selectedTerm = useMemo(
    () => selectedCategory?.terms?.find((t) => t.code === selectedTermCode),
    [selectedCategory, selectedTermCode]
  );

  // Available categories (excluding selected source category)
  const availableCategories = useMemo(
    () =>
      categoriesWithTerms.filter((cat) => cat.code !== selectedCategoryCode),
    [categoriesWithTerms, selectedCategoryCode]
  );
  const [selectedAvailableCategoryCode, setSelectedAvailableCategoryCode] =
    useState<string>(availableCategories[0]?.code || '');
  const selectedAvailableCategory = useMemo(
    () =>
      availableCategories.find(
        (cat) => cat.code === selectedAvailableCategoryCode
      ),
    [availableCategories, selectedAvailableCategoryCode]
  );

  // Terms in selected available category
  const termsInAvailableCategory = selectedAvailableCategory?.terms || [];

  // State for checked terms (codes)
  const [checkedTermCodes, setCheckedTermCodes] = useState<string[]>([]);

  // When category changes, reset term and available category
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const newCatCode = e.target.value as string;
    setSelectedCategoryCode(newCatCode);
    const newCat = categoriesWithTerms.find((cat) => cat.code === newCatCode);
    setSelectedTermCode(newCat?.terms?.[0]?.code || '');
    // Pick first available category that's not the selected one
    const firstAvailable =
      categoriesWithTerms.find((c) => c.code !== newCatCode)?.code || '';
    setSelectedAvailableCategoryCode(firstAvailable);
    setCheckedTermCodes([]);
  };

  // When term changes, reset checked terms
  const handleTermChange = (e: SelectChangeEvent<string>) => {
    setSelectedTermCode(e.target.value as string);
    setCheckedTermCodes([]);
  };

  // When available category changes, reset checked terms
  const handleAvailableCategoryClick = (code: string) => {
    setSelectedAvailableCategoryCode(code);
    setCheckedTermCodes([]);
  };

  // Toggle checked terms
  const handleToggleTerm = (termCode: string) => {
    setCheckedTermCodes((prev) =>
      prev.includes(termCode)
        ? prev.filter((code) => code !== termCode)
        : [...prev, termCode]
    );
  };

  // Save associations for the selected term
  const handleSaveAssociations = () => {
    if (!selectedCategory || !selectedTerm) return;
    const categoryIndex = categories.findIndex(
      (cat) => cat.code === selectedCategory.code
    );
    const termIndex =
      selectedCategory.terms?.findIndex((t) => t.code === selectedTerm.code) ??
      -1;
    if (categoryIndex === -1 || termIndex === -1) return;
    // Build new associations array
    const newAssociations = termsInAvailableCategory
      .filter((term) => checkedTermCodes.includes(term.code))
      .map((term) => ({
        name: term.name,
        identifier: term.identifier,
        description: term.description,
        code: term.code,
        status: term.status,
        category: selectedAvailableCategory?.code || '',
        index: term.index,
      }));
    updateTermAssociations(categoryIndex, termIndex, newAssociations);
  };

  // Pre-select checked terms if associations exist
  React.useEffect(() => {
    if (!selectedTerm || !selectedAvailableCategory) {
      setCheckedTermCodes([]);
      return;
    }
    const associatedCodes = (selectedTerm.associations || [])
      .filter((a) => a.category === selectedAvailableCategory.code)
      .map((a) => a.code);
    setCheckedTermCodes(associatedCodes);
  }, [selectedTerm, selectedAvailableCategory]);

  // Gather all terms with associations for the view section
  const allTermsWithAssociations = useMemo(
    () =>
      categoriesWithTerms
        .flatMap((cat) =>
          (cat.terms || []).map((term) => ({
            ...term,
            categoryName: cat.name,
            categoryCode: cat.code,
          }))
        )
        .filter(
          (term) =>
            Array.isArray(term.associations) && term.associations.length > 0
        ),
    [categoriesWithTerms]
  );

  return (
    <Box>
      {/* Existing Associations Section */}
      {allTermsWithAssociations.length > 0 && (
        <Box mb={4}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            gutterBottom
            sx={{
              textTransform: 'uppercase',
              color: 'text.secondary',
              fontSize: 15,
            }}
          >
            Existing Associations
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            View associations between terms in this framework.
          </Typography>
          <List>
            {allTermsWithAssociations.map((term) => (
              <ListItem
                key={term.identifier}
                component="li"
                sx={{ alignItems: 'flex-start', py: 1.5 }}
              >
                <Box flex={1}>
                  <Typography fontWeight={600} fontSize={15} mb={0.5}>
                    {term.name}
                    <Typography
                      component="span"
                      color="text.secondary"
                      fontWeight={400}
                      fontSize={13}
                      ml={1}
                    >
                      ({term.categoryName})
                    </Typography>
                  </Typography>
                  <AssociationCategories
                    categories={
                      term.associations?.map((a) => ({
                        identifier: a.category,
                        name: a.category,
                        code: a.category,
                        status: 'Live',
                        terms: [],
                      })) || []
                    }
                    termName={term.name}
                    categoryName={term.categoryName}
                    onBadgeClick={(_, termName, categoryName) =>
                      handleBadgeClick(
                        categoriesWithTerms,
                        termName,
                        categoryName
                      )
                    }
                  />
                </Box>
              </ListItem>
            ))}
          </List>
          <AssociationDetailsModal {...modalProps} />
        </Box>
      )}
      {/* Association Form Section */}
      <Typography
        variant="subtitle1"
        fontWeight={700}
        gutterBottom
        sx={{
          textTransform: 'uppercase',
          color: 'text.secondary',
          fontSize: 15,
        }}
      >
        Associations
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Create associations between terms from different categories.
      </Typography>
      <Grid container spacing={3}>
        {/* Left: Select Term to Associate */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, minHeight: 220 }}>
            <Typography fontWeight={600} mb={2}>
              Select Term to Associate
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategoryCode}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categoriesWithTerms.map((cat) => (
                  <MenuItem key={cat.code} value={cat.code}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Term</InputLabel>
              <Select
                value={selectedTermCode}
                label="Term"
                onChange={handleTermChange}
              >
                {(selectedCategory?.terms || []).map((term) => (
                  <MenuItem key={term.code} value={term.code}>
                    {term.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Middle: Available Categories */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, minHeight: 220 }}>
            <Typography fontWeight={600} mb={2}>
              Available Categories
            </Typography>
            <List>
              {availableCategories.map((cat) => (
                <ListItem
                  key={cat.code}
                  component="li"
                  onClick={() => handleAvailableCategoryClick(cat.code)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    cursor: 'pointer',
                    bgcolor:
                      selectedAvailableCategoryCode === cat.code
                        ? 'action.selected'
                        : undefined,
                  }}
                >
                  <ListItemText primary={cat.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right: Terms in Selected Category */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, minHeight: 220 }}>
            <Typography fontWeight={600} mb={2}>
              Terms in {selectedAvailableCategory?.name}
            </Typography>
            <List>
              {termsInAvailableCategory.map((term) => (
                <ListItem key={term.code} disablePadding component="li">
                  <Checkbox
                    checked={checkedTermCodes.includes(term.code)}
                    onChange={() => handleToggleTerm(term.code)}
                  />
                  <ListItemText primary={term.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      {/* Action Buttons */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        mt={4}
        gap={2}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAssociations}
          sx={{ minWidth: 180 }}
        >
          Save Associations
        </Button>
      </Box>
    </Box>
  );
};

export default StepAssociation;

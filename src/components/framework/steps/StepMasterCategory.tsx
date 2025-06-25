import React, { forwardRef, useImperativeHandle } from 'react';
import { StepMasterCategoryHandle } from '@/interfaces/MasterCategoryInterface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MasterCategoryForm from '@/components/masterCategory/MasterCategoryForm';
import MasterCategoryList from '@/components/masterCategory/MasterCategoryList';
import { useMasterCategoryForm } from '@/hooks/useMasterCategoryForm';

const StepMasterCategory = forwardRef<StepMasterCategoryHandle, object>(
  (props, ref) => {
    const {
      form,
      handleFormChange,
      handleFormSubmit,
      formLoading,
      formError,
      formSuccess,
      categories,
      loading,
      error,
    } = useMasterCategoryForm();

    useImperativeHandle(ref, () => ({
      hasUnsavedCategoryForm: () => {
        return Object.values(form).some(
          (val) => typeof val === 'string' && val.trim() !== ''
        );
      },
    }));

    return (
      <Box>
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
          Master Categories
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          These are the available master categories. You can use them in your
          taxonomy.
        </Typography>
        <MasterCategoryList
          categories={categories}
          loading={loading}
          error={error}
        />
        <Box mt={4}>
          <Typography variant="subtitle2" fontSize={16} fontWeight={600} mb={2}>
            If the default master categories do not suit your needs create New
            Master Category
          </Typography>
          <MasterCategoryForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            loading={formLoading}
            error={formError}
            success={formSuccess}
          />
        </Box>
      </Box>
    );
  }
);

StepMasterCategory.displayName = 'StepMasterCategory';

export default StepMasterCategory;

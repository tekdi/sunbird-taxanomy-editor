import React, { useState, useRef } from 'react';
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useRouter } from 'next/router';
import PageLayout from '@/components/layout/PageLayout';
import { StepMasterCategoryHandle } from '@/interfaces/MasterCategoryInterface';
import StepChannel from '@/components/framework/steps/StepChannel';
import StepFramework from '@/components/framework/steps/StepFramework';
import StepMasterCategory from '@/components/framework/steps/StepMasterCategory';
import StepCategory from '@/components/framework/steps/StepCategory';
import type { StepCategoryHandle } from '@/interfaces/CategoryInterface';
import StepTerms from '@/components/framework/steps/StepTerms';
import type { StepTermsHandle } from '@/interfaces/TermInterface';
import frameworkService from '@/services/frameworkService';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import StepAssociation from '@/components/framework/steps/StepAssociation';
import Box from '@mui/material/Box';

// This component manages the taxonomy creation process through a series of steps.
// It allows users to select a channel, framework, master categories, categories, terms, and associations,
// guiding them through the taxonomy management workflow.
const steps = [
  { number: 1, title: 'Channel' },
  { number: 2, title: 'Framework' },
  { number: 3, title: 'Master Categories' },
  { number: 4, title: 'Categories' },
  { number: 5, title: 'Terms' },
  { number: 6, title: 'Associations' },
  { number: 7, title: 'Review' },
  { number: 8, title: 'Publish' },
];

// Controller for managing the taxonomy creation process.
// It handles navigation between steps, fetching framework details, and managing unsaved changes.
const ManageTaxonomy: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { step, setStep, channel, framework, setFramework, setCategories } =
    useFrameworkFormStore();
  const masterCategoryRef = useRef<StepMasterCategoryHandle>(null);
  const categoryRef = useRef<StepCategoryHandle>(null);
  const termsRef = useRef<StepTermsHandle>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const handleNext = async () => {
    setFetchError(null);
    setIsLoading(true);
    try {
      if (step === 3 && masterCategoryRef.current?.hasUnsavedCategoryForm()) {
        setShowUnsavedDialog(true);
        setIsLoading(false);
        return;
      }
      if (step === 4 && categoryRef.current?.hasUnsavedCategories()) {
        setShowUnsavedDialog(true);
        setIsLoading(false);
        return;
      }
      if (step === 5 && termsRef.current?.hasUnsavedTerms()) {
        setShowUnsavedDialog(true);
        setIsLoading(false);
        return;
      }
      switch (step) {
        case 1:
          break;
        case 2:
          if (framework?.identifier) {
            try {
              const data = await frameworkService.getFrameworkById(
                framework.identifier
              );
              if (data && Object.keys(data).length > 0) {
                setFramework(data);
                setCategories(data.categories || []);
              }
              // If data is empty, just proceed
            } catch {
              setFetchError(
                'Failed to fetch framework details. Please try again.'
              );
              setIsLoading(false);
              return;
            }
          }
          break;
        case 3:
          break;
        case 4:
          if (framework?.identifier) {
            try {
              const data = await frameworkService.getFrameworkById(
                framework.identifier
              );
              if (data && Object.keys(data).length > 0) {
                setFramework(data);
                setCategories(data.categories || []);
              }
            } catch {
              setFetchError(
                'Failed to fetch framework details. Please try again.'
              );
              setIsLoading(false);
              return;
            }
          }
          break;
        case 5:
          break;
        case 6:
          break;
        case 7:
          router.push('/frameworks');
          return;
      }
      if (step < steps.length) setStep(step + 1);
    } catch (error) {
      setFetchError('An unexpected error occurred.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDialogCancel = () => {
    setShowUnsavedDialog(false);
  };

  const handleDialogNext = () => {
    setShowUnsavedDialog(false);
    setStep(step + 1);
  };

  return (
    <PageLayout>
      <div
        style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 0' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Manage Taxonomy
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Follow the steps to manage the taxonomy for your framework.
          </Typography>

          <Stepper
            activeStep={step - 1}
            alternativeLabel
            sx={{ mb: 5, background: 'transparent' }}
          >
            {steps.map((stepObj) => (
              <Step key={stepObj.title}>
                <StepLabel>{stepObj.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {fetchError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {fetchError}
            </Alert>
          )}

          <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Step {step}: {steps[step - 1].title}
                </Typography>
              }
              action={
                <Box sx={{ minWidth: 180, textAlign: 'right' }}>
                  {channel?.code && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 400, display: 'block' }}
                    >
                      Channel: <b>{channel.code}</b>
                    </Typography>
                  )}
                  {framework?.code && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 400,
                        display: 'block',
                        mt: channel?.code ? 0.5 : 0,
                      }}
                    >
                      Framework: <b>{framework.code}</b>
                    </Typography>
                  )}
                </Box>
              }
              sx={{
                bgcolor: '#f5f7fa',
                borderBottom: 1,
                borderColor: 'divider',
                py: 2,
                px: 3,
              }}
            />
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              {step === 1 && <StepChannel />}
              {step === 2 && <StepFramework />}
              {step === 3 && <StepMasterCategory ref={masterCategoryRef} />}
              {step === 4 && <StepCategory ref={categoryRef} />}
              {step === 5 && <StepTerms ref={termsRef} />}
              {step === 6 && <StepAssociation />}
              {/* {step === 7 && <StepReview />} */}
              {/* {step === 8 && <StepPublish />} */}
            </CardContent>
            <CardActions
              sx={{
                justifyContent: 'space-between',
                borderTop: 1,
                borderColor: 'divider',
                p: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={step === 1 || isLoading}
                startIcon={<ArrowLeftIcon fontSize="small" />}
                sx={{ minWidth: 120, fontWeight: 600 }}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !channel?.code) ||
                  (step === 2 && !framework?.identifier) ||
                  isLoading
                }
                endIcon={
                  step < steps.length ? (
                    <ArrowRightIcon fontSize="small" />
                  ) : undefined
                }
                variant="contained"
                color="primary"
                sx={{ minWidth: 160, fontWeight: 600 }}
              >
                {isLoading
                  ? 'Loading...'
                  : step < steps.length
                  ? 'Continue'
                  : 'Publish Taxonomy'}
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
      <Dialog open={showUnsavedDialog} onClose={handleDialogCancel}>
        <DialogTitle>
          {step === 3
            ? 'Unsaved Master Category'
            : step === 4
            ? 'Unsaved Category'
            : step === 5
            ? 'Unsaved Terms'
            : 'Unsaved Changes'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {step === 3
              ? 'Are you sure you want to proceed to the next step without creating the new master category?'
              : step === 4
              ? 'Are you sure you want to proceed to the next step without creating the new category?'
              : step === 5
              ? 'Are you sure you want to proceed to the next step without creating the new terms?'
              : 'Are you sure you want to proceed to the next step without saving your changes?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogCancel}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDialogNext}
            color="primary"
            variant="contained"
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default ManageTaxonomy;

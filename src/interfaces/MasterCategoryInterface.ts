export interface MasterCategory {
  identifier: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  // Add other fields as needed for future use
  [key: string]: unknown;
}

export interface StepMasterCategoryHandle {
  hasUnsavedCategoryForm: () => boolean;
}

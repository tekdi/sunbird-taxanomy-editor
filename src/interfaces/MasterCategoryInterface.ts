export interface MasterCategory {
  identifier: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  // Add other fields as needed for future use
  [key: string]: unknown;
}

export interface MasterCategoryListProps {
  categories: MasterCategory[];
  loading: boolean;
  error: string | null;
}

export interface MasterCategoryFormProps {
  form: {
    name: string;
    code: string;
    description: string;
    targetIdFieldName: string;
    searchLabelFieldName: string;
    searchIdFieldName: string;
    orgIdFieldName: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export interface StepMasterCategoryHandle {
  hasUnsavedCategoryForm: () => boolean;
}

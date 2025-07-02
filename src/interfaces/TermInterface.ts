import { Association } from './AssociationInterface';

export interface Term {
  name: string;
  code: string;
  description?: string;
  status: string;
  identifier: string;
  label?: string;
  associations?: Association[];
  index?: number;
  category?: string;
}

export interface StepTermsHandle {
  hasUnsavedTerms: () => boolean;
}

import { Category } from './CategoryInterface';

export interface Framework {
  lastStatusChangedOn: string;
  createdOn: string;
  channel: string;
  name: string;
  identifier: string;
  description?: string;
  lastUpdatedOn: string;
  languageCode: string[];
  systemDefault: string;
  versionKey: string;
  code: string;
  objectType: string;
  status: string;
  type: string;
  categories: Category[];
}

export interface FrameworksState {
  frameworks: Framework[];
  loading: boolean;
  error: string | null;
  fetchFrameworks: () => Promise<void>;
}

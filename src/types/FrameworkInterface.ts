export interface Framework {
  identifier: string;
  name: string;
  code: string;
  categories?: string[];
  status: string;
  lastUpdatedOn?: string;
  channel?: string;
  [key: string]: unknown;
}

export interface FrameworksState {
  frameworks: Framework[];
  loading: boolean;
  error: string | null;
  fetchFrameworks: () => Promise<void>;
}

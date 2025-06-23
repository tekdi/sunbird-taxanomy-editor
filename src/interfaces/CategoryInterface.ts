import { Term } from './TermInterface';

export interface Category {
  identifier: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  terms?: Term[];
  index?: number;
}

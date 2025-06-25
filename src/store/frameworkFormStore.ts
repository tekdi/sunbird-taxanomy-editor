import { create } from 'zustand';
import type { Channel } from '@/interfaces/ChannelInterface';
import type { Framework } from '@/interfaces/FrameworkInterface';
import type { Category } from '@/interfaces/CategoryInterface';
import type { Term } from '@/interfaces/TermInterface';

interface FrameworkFormStoreState {
  step: number;
  channel: Channel | null;
  framework: Partial<Framework> | null;
  categories: Category[];
  currentCategory?: Category;
  setStep: (step: number) => void;
  setChannel: (channel: Channel) => void;
  setFramework: (framework: Partial<Framework>) => void;
  setCategories: (categories: Category[]) => void;
  setCurrentCategory: (category: Category) => void;
  addTermToCategory: (categoryIndex: number, term: Term) => void;
  updateTermAssociations: (
    categoryIndex: number,
    termIndex: number,
    associations: Term['associations']
  ) => void;
  reset: () => void;
}

const INITIAL_STATE: Omit<
  FrameworkFormStoreState,
  | 'setStep'
  | 'setChannel'
  | 'setFramework'
  | 'setCategories'
  | 'setCurrentCategory'
  | 'addTermToCategory'
  | 'updateTermAssociations'
  | 'reset'
> = {
  step: 1,
  channel: null,
  framework: null,
  categories: [],
};

export const useFrameworkFormStore = create<FrameworkFormStoreState>((set) => ({
  ...INITIAL_STATE,
  setStep: (step) => set({ step }),
  setChannel: (channel) => set({ channel }),
  setFramework: (framework) =>
    set((state) => ({ framework: { ...state.framework, ...framework } })),
  setCategories: (categories) => set({ categories }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
  addTermToCategory: (categoryIndex, term) =>
    set((state) => {
      const updatedCategories = [...state.categories];
      if (!updatedCategories[categoryIndex].terms) {
        updatedCategories[categoryIndex].terms = [];
      }
      updatedCategories[categoryIndex].terms!.push(term);
      return { categories: updatedCategories };
    }),
  updateTermAssociations: (categoryIndex, termIndex, associations) =>
    set((state) => {
      const updatedCategories = [...state.categories];
      const terms = updatedCategories[categoryIndex].terms || [];
      if (terms[termIndex]) {
        terms[termIndex] = {
          ...terms[termIndex],
          associations,
        };
      }
      return { categories: updatedCategories };
    }),
  reset: () => set({ ...INITIAL_STATE }),
}));

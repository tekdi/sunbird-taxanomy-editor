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

// Initial state for the framework form store
// This state includes the initial step, channel, framework, and categories.
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

// Zustand store for managing framework form state
export const useFrameworkFormStore = create<FrameworkFormStoreState>((set) => ({
  ...INITIAL_STATE,
  // Handles setting the current step in the framework form
  // This is used to navigate through the multi-step form.
  setStep: (step) => set({ step }),

  // Handles setting the selected channel
  setChannel: (channel) => set({ channel }),

  // Handles setting the framework data
  setFramework: (framework) =>
    set((state) => ({ framework: { ...state.framework, ...framework } })),
  setCategories: (categories) => set({ categories }),
  setCurrentCategory: (category) => set({ currentCategory: category }),

  // Adds a new term to the specified category
  // If the category does not have a terms array, it initializes it.
  addTermToCategory: (categoryIndex, term) =>
    set((state) => {
      const updatedCategories = [...state.categories];
      if (!updatedCategories[categoryIndex].terms) {
        updatedCategories[categoryIndex].terms = [];
      }
      updatedCategories[categoryIndex].terms!.push(term);
      return { categories: updatedCategories };
    }),

  // Updates the associations of a term in a specific category
  // It checks if the term exists in the category's terms array before updating.
  // If the term does not exist, it will not modify the state.
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

import { Framework } from '@/types/FrameworkInterface';
import { Category } from '@/types/CategoryInterface';
import { Term } from '@/types/TermInterface';
import { Association } from '@/types/AssociationInterface';

// Get live categories from a framework
export function getLiveCategories(framework: Framework | null): Category[] {
  if (!framework || !Array.isArray(framework.categories)) return [];
  return framework.categories.filter((cat) => cat && cat.status === 'Live');
}

// Get live terms from a category
export function getLiveTerms(category: Category | null): Term[] {
  if (!category || !Array.isArray(category.terms)) return [];
  return category.terms.filter((term) => term && term.status === 'Live');
}

// Group associations by category and return as array of Category objects
export function groupAssociationsByCategory(
  associations: Association[]
): Category[] {
  const grouped: { [cat: string]: Association[] } = {};
  associations.forEach((assoc) => {
    if (!assoc || !assoc.category) return;
    if (!grouped[assoc.category]) grouped[assoc.category] = [];
    grouped[assoc.category].push(assoc);
  });
  return Object.entries(grouped).map(([cat, assocs]) => ({
    identifier: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    code: cat,
    status: 'Live',
    terms: assocs as unknown as Term[], // treat as Term[] for modal
  }));
}

import { Framework } from '@/interfaces/FrameworkInterface';
import { Category } from '@/interfaces/CategoryInterface';
import { Term } from '@/interfaces/TermInterface';
import { Association } from '@/interfaces/AssociationInterface';
import { publishFramework } from '@/utils/HelperService';
import { useFrameworkFormStore } from '@/store/frameworkFormStore';
import { useFrameworksStore } from '@/store/frameworksStore';

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

// --- API logic ---
export interface CategoryInput {
  name: string;
  code: string;
  description: string;
}

function getEnvVars() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const cookie = process.env.NEXT_PUBLIC_COOKIE;
  const interfaceUrl = process.env.NEXT_PUBLIC_INTERFACE_URL;
  if (!tenantId || !authToken || !cookie || !interfaceUrl) {
    throw new Error('Missing environment variables');
  }
  return { tenantId, authToken, cookie, interfaceUrl };
}

function buildHeaders() {
  const { tenantId, authToken, cookie } = getEnvVars();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('tenantId', tenantId);
  myHeaders.append('Authorization', `Bearer ${authToken}`);
  myHeaders.append('Cookie', cookie);
  return myHeaders;
}

export async function createCategory(
  category: CategoryInput,
  frameworkCode: string
): Promise<unknown> {
  const { interfaceUrl } = getEnvVars();
  const myHeaders = buildHeaders();
  const raw = JSON.stringify({
    request: {
      category: {
        name: category.name,
        code: category.code,
        description: category.description,
      },
    },
  });
  const url = `${interfaceUrl}/api/framework/v1/category/create?framework=${frameworkCode}`;
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok || data.responseCode !== 'OK') {
    throw new Error(data?.params?.errmsg || 'Failed to create category');
  }
  return data;
}

export async function batchCreateCategories(
  categories: CategoryInput[],
  frameworkCode: string
): Promise<
  { status: 'success' | 'failed'; message: string; category: CategoryInput }[]
> {
  const results: {
    status: 'success' | 'failed';
    message: string;
    category: CategoryInput;
  }[] = [];

  for (const category of categories) {
    try {
      await createCategory(category, frameworkCode);
      results.push({
        status: 'success',
        message: 'Successfully created',
        category,
      });
    } catch (err: unknown) {
      let msg = 'Failed to create category';
      if (err instanceof Error) msg = err.message;
      results.push({ status: 'failed', message: msg, category });
    }
  }

  // Get channelId from stores and publish the framework after all categories are created
  const successfulCategories = results.filter(
    (result) => result.status === 'success'
  );
  if (successfulCategories.length > 0) {
    const framework = useFrameworkFormStore.getState().framework;
    const frameworks = useFrameworksStore.getState().frameworks;

    // Try to get channelId from frameworkFormStore first, then from frameworksStore
    let channelId: string | undefined;
    if (framework?.channel) {
      channelId = framework.channel;
    } else {
      const currentFramework = frameworks.find(
        (fw) => fw.code === frameworkCode
      );
      channelId = currentFramework?.channel;
    }

    if (channelId) {
      try {
        await publishFramework(frameworkCode, channelId);
      } catch (publishError) {
        console.warn(
          'Failed to publish framework after batch category creation:',
          publishError
        );
        // Don't throw here as the main category creation was successful
      }
    }
  }

  return results;
}

export async function retryCreateCategory(
  category: CategoryInput,
  frameworkCode: string
): Promise<unknown> {
  return createCategory(category, frameworkCode);
}

// Get all terms from all categories
export function getAllTermsFromCategories(categories: Category[]): (Record<
  string,
  unknown
> & {
  categoryName: string;
  categoryCode: string;
})[] {
  return categories.flatMap((category) =>
    (category.terms || []).map((term) => ({
      ...term,
      categoryName: category.name,
      categoryCode: category.code,
    }))
  );
}

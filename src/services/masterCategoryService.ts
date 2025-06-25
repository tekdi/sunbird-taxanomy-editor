import { MasterCategory } from '@/interfaces/MasterCategoryInterface';
import { URL_CONFIG } from '@/utils/url.config';
import { prepareHeaders } from '@/utils/ApiUtilityService';

export async function fetchMasterCategories(): Promise<MasterCategory[]> {
  const myHeaders = prepareHeaders();
  const raw = JSON.stringify({
    request: {
      filters: {
        status: ['Draft', 'Live'],
        objectType: 'Category',
      },
    },
  });
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };
  const url = URL_CONFIG.API.MASTER_CATEGORY_SEARCH;
  const response = await fetch(url, requestOptions);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data?.result?.Category))
    throw new Error('Malformed API response');
  return data.result.Category as MasterCategory[];
}

export async function createMasterCategory(category: {
  name: string;
  code: string;
  description: string;
  targetIdFieldName: string;
  searchLabelFieldName: string;
  searchIdFieldName: string;
  orgIdFieldName: string;
}) {
  const myHeaders = prepareHeaders();
  const raw = JSON.stringify({
    request: {
      category,
    },
  });
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };
  const url = URL_CONFIG.API.MASTER_CATEGORY_CREATE;
  const response = await fetch(url, requestOptions);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  if (data.responseCode !== 'OK')
    throw new Error(data?.params?.errmsg || 'Failed to create category');
  return data;
}

export function generateMasterCategoryFields(code: string) {
  return {
    targetIdFieldName: `target${capitalizeFirst(code)}Ids`,
    searchLabelFieldName: `se_${pluralize(code)}`,
    searchIdFieldName: `se_${code}Ids`,
    orgIdFieldName: `${code}Ids`,
  };
}

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(str: string) {
  // Simple pluralization: add 's' if not already ending with 's'
  return str.endsWith('s') ? str : str + 's';
}

import { Framework } from '@/interfaces/FrameworkInterface';
import { URL_CONFIG } from '@/utils/url.config';

const getFrameworkById = async (id: string): Promise<Framework> => {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const cookie = process.env.NEXT_PUBLIC_COOKIE;
  if (!tenantId || !authToken || !cookie || !URL_CONFIG.API.FRAMEWORK_READ) {
    throw new Error('Missing environment variables');
  }
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('tenantId', tenantId);
  myHeaders.append('Authorization', `Bearer ${authToken}`);
  myHeaders.append('Cookie', cookie);
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow' as RequestRedirect,
  };
  const url = `${URL_CONFIG.API.FRAMEWORK_READ}/${id}`;
  const response = await fetch(url, requestOptions);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  if (!data?.result?.framework) throw new Error('Malformed API response');
  return data.result.framework as Framework;
};

const frameworkService = {
  getFrameworkById,
};

export default frameworkService;

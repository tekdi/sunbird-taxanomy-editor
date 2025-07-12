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

export async function createFramework(
  framework: { name: string; code: string; description: string },
  channelId: string
) {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  if (!tenantId || !authToken) {
    throw new Error('Missing environment variables');
  }
  const myHeaders = new Headers();
  myHeaders.append('X-Channel-Id', channelId);
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('tenantId', tenantId);
  myHeaders.append('Authorization', `Bearer ${authToken}`);

  const raw = JSON.stringify({
    request: {
      framework: {
        name: framework.name,
        code: framework.code,
        description: framework.description,
        type: 'K-12',
        channel: channelId,
      },
    },
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };
  const url = URL_CONFIG.API.FRAMEWORK_CREATE;
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok || data.responseCode !== 'OK') {
    throw new Error(
      data?.params?.errmsg ?? data?.params?.err ?? `Error: ${response.status}`
    );
  }
  return data;
}

const frameworkService = {
  getFrameworkById,
  createFramework,
};

export default frameworkService;

import { Framework } from '@/interfaces/FrameworkInterface';
import { URL_CONFIG } from '@/utils/url.config';
import { prepareHeaders } from '@/utils/ApiUtilityService';

const getFrameworkById = async (id: string): Promise<Framework> => {
  const myHeaders = prepareHeaders();
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
  channelId: string,
  channelName: string
) {
  const myHeaders = prepareHeaders();
  myHeaders.append('X-Channel-Id', channelId);
  const raw = JSON.stringify({
    request: {
      framework: {
        name: framework.name,
        code: framework.code,
        description: framework.description,
        type: 'K-12',
        channel: channelName,
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

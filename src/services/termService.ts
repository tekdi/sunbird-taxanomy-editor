export interface TermInput {
  name: string;
  code: string;
  description: string;
  label: string;
  categoryCode: string;
}

export interface UpdateTermInput {
  identifier: string;
  code: string;
  categoryCode: string;
  description: string;
  label: string;
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

function buildHeaders(channelId?: string) {
  const { tenantId, authToken, cookie } = getEnvVars();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  if (channelId) myHeaders.append('X-Channel-Id', channelId);
  myHeaders.append('tenantId', tenantId);
  myHeaders.append('Authorization', `Bearer ${authToken}`);
  myHeaders.append('Cookie', cookie);
  return myHeaders;
}

export async function createTerm(
  term: TermInput,
  frameworkCode: string
): Promise<unknown> {
  const { interfaceUrl } = getEnvVars();
  const myHeaders = buildHeaders();
  const raw = JSON.stringify({
    request: {
      term: {
        name: term.name,
        label: term.label,
        description: term.description,
        code: term.code,
      },
    },
  });
  const url = `${interfaceUrl}/api/framework/v1/term/create?framework=${frameworkCode}&category=${term.categoryCode}`;
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok || data.responseCode !== 'OK') {
    throw new Error(data?.params?.errmsg || 'Failed to create term');
  }
  return data;
}

export async function updateTerm(
  input: UpdateTermInput,
  frameworkCode: string,
  channelId: string
): Promise<unknown> {
  const { interfaceUrl } = getEnvVars();
  const myHeaders = buildHeaders(channelId);
  const raw = JSON.stringify({
    request: {
      term: {
        description: input.description,
        label: input.label,
      },
    },
  });
  const url = `${interfaceUrl}/api/framework/v1/term/update/${input.code}?framework=${frameworkCode}&category=${input.categoryCode}`;
  const requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok || data.responseCode !== 'OK') {
    throw new Error(data?.params?.errmsg || 'Failed to update term');
  }
  return data;
}

export async function batchCreateTerms(
  terms: TermInput[],
  frameworkCode: string
): Promise<
  { status: 'success' | 'failed'; message: string; term: TermInput }[]
> {
  const results: {
    status: 'success' | 'failed';
    message: string;
    term: TermInput;
  }[] = [];
  for (const term of terms) {
    try {
      await createTerm(term, frameworkCode);
      results.push({
        status: 'success',
        message: 'Successfully created',
        term,
      });
    } catch (err: unknown) {
      let msg = 'Failed to create term';
      if (err instanceof Error) msg = err.message;
      results.push({
        status: 'failed',
        message: msg,
        term,
      });
    }
  }
  return results;
}

export async function retryCreateTerm(
  term: TermInput,
  frameworkCode: string
): Promise<unknown> {
  return createTerm(term, frameworkCode);
}

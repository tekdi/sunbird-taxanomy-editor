import { publishFrameworkAfterBatchOperation } from '@/utils/HelperService';

export interface AssociationPayload {
  associations: { identifier: string }[];
}

export interface BatchAssociationCreateInput {
  fromTermCode: string;
  frameworkCode: string;
  categoryCode: string;
  associations: { identifier: string }[];
}

export async function createTermAssociations({
  fromTermCode,
  frameworkCode,
  categoryCode,
  associations,
}: {
  fromTermCode: string;
  frameworkCode: string;
  categoryCode: string;
  associations: { identifier: string }[];
}): Promise<unknown> {
  const baseUrl = process.env.NEXT_PUBLIC_INTERFACE_URL;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const cookie = process.env.NEXT_PUBLIC_COOKIE;

  if (!baseUrl || !tenantId || !authToken || !cookie) {
    throw new Error('Missing environment variables');
  }

  const url = `${baseUrl}/api/framework/v1/term/update/${fromTermCode}?framework=${frameworkCode}&category=${categoryCode}`;

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('tenantId', tenantId);
  myHeaders.append('Authorization', `Bearer ${authToken}`);
  myHeaders.append('Cookie', cookie);

  const raw = JSON.stringify({
    request: {
      term: {
        associations,
      },
    },
  });

  const requestOptions: RequestInit = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update associations: ${errorText}`);
  }
  return response.json();
}

export async function batchCreateTermAssociations(
  updates: BatchAssociationCreateInput[],
  channelId?: string
): Promise<
  { result?: unknown; error?: Error; input: BatchAssociationCreateInput }[]
> {
  const results = await Promise.all(
    updates.map(async (input) => {
      try {
        const result = await createTermAssociations(input);
        return { result, input };
      } catch (error) {
        return { error: error as Error, input };
      }
    })
  );
  // Publish framework after all associations are updated
  if (updates.length > 0) {
    const frameworkCode = updates[0].frameworkCode;
    await publishFrameworkAfterBatchOperation(
      frameworkCode,
      'association updates',
      channelId
    );
  }
  return results;
}

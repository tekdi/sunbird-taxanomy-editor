// Retrieves required environment variables for API requests. Throws an error if any are missing.
export function getEnvVars() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const cookie = process.env.NEXT_PUBLIC_COOKIE;
  const interfaceUrl = process.env.NEXT_PUBLIC_INTERFACE_URL;
  if (!tenantId || !authToken || !cookie || !interfaceUrl) {
    throw new Error('Missing environment variables');
  }
  return { tenantId, authToken, cookie, interfaceUrl };
}

// Prepares HTTP headers for API requests, including tenant, auth, and cookie headers as needed.
export function prepareHeaders(options?: {
  addCookie?: boolean;
  addAuth?: boolean;
  extraHeaders?: Record<string, string>;
}) {
  const { tenantId, authToken, cookie } = getEnvVars();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('tenantId', tenantId);

  // Add authorization header if addAuth is not explicitly set to false
  if (options?.addAuth !== false)
    headers.append('Authorization', `Bearer ${authToken}`);

  // Add cookie header if addCookie is not explicitly set to false
  if (options?.addCookie !== false) headers.append('Cookie', cookie);

  // Add any extra headers provided in options
  // Useful for custom headers like 'X-Channel-id' or similar
  if (options?.extraHeaders) {
    Object.entries(options.extraHeaders).forEach(([k, v]) =>
      headers.append(k, v)
    );
  }
  return headers;
}

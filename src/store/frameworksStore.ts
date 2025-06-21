import { create } from 'zustand';
import { URL_CONFIG } from '@/utils/url.config';
import { FrameworksState } from '@/types/FrameworkInterface';

export const useFrameworksStore = create<FrameworksState>((set) => ({
  frameworks: [],
  loading: false,
  error: null,
  fetchFrameworks: async () => {
    set({ loading: true, error: null });
    try {
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
      const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const cookie = process.env.NEXT_PUBLIC_COOKIE;
      const interfaceUrl = process.env.NEXT_PUBLIC_INTERFACE_URL;
      if (!tenantId || !authToken || !cookie || !interfaceUrl) {
        set({
          error: 'Missing environment variables',
          frameworks: [],
          loading: false,
        });
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('tenantId', tenantId);
      myHeaders.append('Authorization', `Bearer ${authToken}`);
      myHeaders.append('Cookie', cookie);
      const raw = JSON.stringify({
        request: {
          filters: {
            status: ['Draft', 'Live'],
            objectType: 'Framework',
          },
        },
      });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect,
      };
      const url = URL_CONFIG.API.COMPOSITE_SEARCH;
      const response = await fetch(url, requestOptions);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data?.result?.Framework)) {
        set({
          frameworks: [],
          loading: false,
          error: 'Malformed API response',
        });
        return;
      }
      set({
        frameworks: data.result.Framework.map((fw: unknown) => {
          if (typeof fw === 'object' && fw !== null) {
            const obj = fw as { [key: string]: unknown };
            return {
              identifier:
                typeof obj.identifier === 'string' ||
                typeof obj.identifier === 'number'
                  ? String(obj.identifier)
                  : '',
              name:
                typeof obj.name === 'string' || typeof obj.name === 'number'
                  ? String(obj.name)
                  : '',
              code:
                typeof obj.code === 'string' || typeof obj.code === 'number'
                  ? String(obj.code)
                  : '',
              categories: Array.isArray(obj.categories)
                ? (obj.categories as string[])
                : [],
              status:
                typeof obj.status === 'string' || typeof obj.status === 'number'
                  ? String(obj.status)
                  : '',
              lastUpdatedOn:
                typeof obj.lastUpdatedOn === 'string' ||
                typeof obj.lastUpdatedOn === 'number'
                  ? String(obj.lastUpdatedOn)
                  : '',
              channel:
                typeof obj.channel === 'string' ||
                typeof obj.channel === 'number'
                  ? String(obj.channel)
                  : '',
            };
          }
          return {
            identifier: '',
            name: '',
            code: '',
            categories: [],
            status: '',
            lastUpdatedOn: '',
            channel: '',
          };
        }),
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      console.error('Frameworks fetch error:', err);
      set({
        error:
          err instanceof Error ? err.message : 'Failed to fetch frameworks',
        loading: false,
        frameworks: [],
      });
    }
  },
}));

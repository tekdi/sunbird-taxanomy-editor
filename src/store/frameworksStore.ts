import { create } from 'zustand';
import { URL_CONFIG } from '@/utils/url.config';
import { FrameworksState, Framework } from '@/interfaces/FrameworkInterface';
import { Category } from '@/interfaces/CategoryInterface';

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
        frameworks: data.result.Framework.map((fw: unknown): Framework => {
          if (typeof fw === 'object' && fw !== null) {
            const obj = fw as { [key: string]: unknown };
            return {
              lastStatusChangedOn:
                typeof obj.lastStatusChangedOn === 'string'
                  ? obj.lastStatusChangedOn
                  : '',
              createdOn: typeof obj.createdOn === 'string' ? obj.createdOn : '',
              channel: typeof obj.channel === 'string' ? obj.channel : '',
              name: typeof obj.name === 'string' ? obj.name : '',
              identifier:
                typeof obj.identifier === 'string' ? obj.identifier : '',
              description:
                typeof obj.description === 'string'
                  ? obj.description
                  : undefined,
              lastUpdatedOn:
                typeof obj.lastUpdatedOn === 'string' ? obj.lastUpdatedOn : '',
              languageCode: Array.isArray(obj.languageCode)
                ? (obj.languageCode as string[])
                : [],
              systemDefault:
                typeof obj.systemDefault === 'string' ? obj.systemDefault : '',
              versionKey:
                typeof obj.versionKey === 'string' ? obj.versionKey : '',
              code: typeof obj.code === 'string' ? obj.code : '',
              objectType:
                typeof obj.objectType === 'string' ? obj.objectType : '',
              status: typeof obj.status === 'string' ? obj.status : '',
              type: typeof obj.type === 'string' ? obj.type : '',
              categories: Array.isArray(obj.categories)
                ? (obj.categories as Category[])
                : [],
            };
          }
          return {
            lastStatusChangedOn: '',
            createdOn: '',
            channel: '',
            name: '',
            identifier: '',
            description: undefined,
            lastUpdatedOn: '',
            languageCode: [],
            systemDefault: '',
            versionKey: '',
            code: '',
            objectType: '',
            status: '',
            type: '',
            categories: [],
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

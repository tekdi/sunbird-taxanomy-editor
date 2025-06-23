import { create } from 'zustand';
import { URL_CONFIG } from '@/utils/url.config';
import { ChannelState } from '@/interfaces/ChannelInterface';

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  loading: false,
  error: null,
  fetchChannels: async () => {
    set({ loading: true, error: null });
    try {
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
      const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      const cookie = process.env.NEXT_PUBLIC_COOKIE;
      const interfaceUrl = process.env.NEXT_PUBLIC_INTERFACE_URL;
      if (!tenantId || !authToken || !cookie || !interfaceUrl) {
        set({
          error: 'Missing environment variables',
          channels: [],
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
            status: ['Live'],
            objectType: 'Channel',
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
      if (!Array.isArray(data?.result?.Channel)) {
        set({
          channels: [],
          loading: false,
          error: 'Malformed API response',
        });
        return;
      }
      set({
        channels: data.result.Channel.map((ch: unknown) => {
          if (typeof ch === 'object' && ch !== null) {
            const obj = ch as Record<string, unknown>;
            const {
              identifier = '',
              name = '',
              status = '',
              lastUpdatedOn = '',
              ...extra
            } = obj;
            return {
              identifier: String(identifier),
              name: String(name),
              status: String(status),
              lastUpdatedOn: String(lastUpdatedOn),
              extra,
            };
          }
          return {
            identifier: '',
            name: '',
            status: '',
            lastUpdatedOn: '',
          };
        }),
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      console.error('Channels fetch error:', err);
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch channels',
        loading: false,
        channels: [],
      });
    }
  },
}));

import { URL_CONFIG } from '@/utils/url.config';

// Helper to get code from channel
export function getChannelCode(ch: {
  code?: string;
  extra?: Record<string, unknown>;
  identifier: string;
}): string {
  if (typeof ch.code === 'string' && ch.code) return ch.code;
  if (ch.extra && typeof ch.extra.code === 'string' && ch.extra.code)
    return ch.extra.code;
  return ch.identifier;
}

// Normalize channels to ensure code property exists
export function normalizeChannels<
  T extends {
    code?: string;
    extra?: Record<string, unknown>;
    identifier: string;
  }
>(channels: T[]) {
  return channels.map((ch) => ({
    ...ch,
    code: getChannelCode(ch),
  }));
}

// Filter channels by search and status
export function filterChannels<
  T extends { name?: string; code?: string; status: string }
>(channels: T[], search: string, selectedStatus: string[]) {
  const q = search.trim().toLowerCase();
  return channels.filter((channel) => {
    const matchesSearch =
      (channel.name?.toLowerCase() ?? '').includes(q) ||
      (channel.code?.toLowerCase() ?? '').includes(q);
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(channel.status);
    return matchesSearch && matchesStatus;
  });
}

// Validate channel form fields
export function validateChannelForm(channel: { name: string; code: string }) {
  if (!channel.name.trim() || !channel.code.trim()) {
    return 'Both Channel Name and Channel Code are required.';
  }
  return null;
}

// Create channel API call
export async function createChannel(
  channel: { name: string; code: string; description: string },
  env: {
    tenantId: string;
    authToken: string;
    cookie: string;
    interfaceUrl: string;
  }
) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('tenantId', env.tenantId);
  myHeaders.append('Authorization', `Bearer ${env.authToken}`);
  myHeaders.append('Cookie', env.cookie);
  const raw = JSON.stringify({
    request: {
      channel: {
        name: channel.name,
        code: channel.code,
        description: channel.description,
      },
    },
  });
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  };
  const url = URL_CONFIG.API.CHANNEL_CREATE;
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  if (!response.ok || data.responseCode !== 'OK') {
    throw new Error(
      data?.params?.errmsg ?? data?.params?.err ?? `Error: ${response.status}`
    );
  }
  return data;
}

export interface Channel {
  identifier: string;
  name: string;
  code?: string;
  status: string;
  lastUpdatedOn?: string;
  extra?: Record<string, unknown>;
}

export interface ChannelState {
  channels: Channel[];
  loading: boolean;
  error: string | null;
  fetchChannels: () => Promise<void>;
}

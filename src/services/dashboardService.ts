/**
 * Helper to get lastUpdatedOn from a channel object.
 */
export function getChannelLastUpdatedOn(ch: {
  lastUpdatedOn?: string;
  extra?: Record<string, unknown>;
}): string | undefined {
  if (typeof ch.lastUpdatedOn === 'string' && ch.lastUpdatedOn)
    return ch.lastUpdatedOn;
  if (
    ch.extra &&
    typeof ch.extra.lastUpdatedOn === 'string' &&
    ch.extra.lastUpdatedOn
  )
    return ch.extra.lastUpdatedOn;
  return undefined;
}

/**
 * Sort frameworks by lastUpdatedOn (descending)
 */
export function sortFrameworksByLastUpdated<
  T extends { lastUpdatedOn?: string }
>(frameworks: T[]): T[] {
  return [...frameworks].sort((a, b) => {
    const dateA = a.lastUpdatedOn ? new Date(a.lastUpdatedOn).getTime() : 0;
    const dateB = b.lastUpdatedOn ? new Date(b.lastUpdatedOn).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Sort channels by lastUpdatedOn (descending)
 */
export function sortChannelsByLastUpdated<
  T extends { lastUpdatedOn?: string; extra?: Record<string, unknown> }
>(channels: T[]): T[] {
  return [...channels].sort((a, b) => {
    const dateA = getChannelLastUpdatedOn(a)
      ? new Date(getChannelLastUpdatedOn(a)!).getTime()
      : 0;
    const dateB = getChannelLastUpdatedOn(b)
      ? new Date(getChannelLastUpdatedOn(b)!).getTime()
      : 0;
    return dateB - dateA;
  });
}

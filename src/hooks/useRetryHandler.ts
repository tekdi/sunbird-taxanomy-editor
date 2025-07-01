import React from 'react';
import { Framework } from '@/interfaces/FrameworkInterface';

interface RetryableItem {
  name: string;
  code: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  [key: string]: unknown;
}

interface RetryInput {
  name: string;
  code: string;
  description: string;
  [key: string]: unknown;
}

/**
 * Reusable hook for handling retry logic
 * Eliminates code duplication between useStepCategory and useStepTerms
 */
export function useRetryHandler<T extends RetryableItem>(
  batchStatus: T[],
  setBatchStatus: React.Dispatch<React.SetStateAction<T[]>>,
  framework: Partial<Framework> | null,
  retryFunction: (item: RetryInput, frameworkCode: string) => Promise<void>,
  onSuccess: (item: T) => void
) {
  const handleRetry = async (idx: number) => {
    if (!batchStatus[idx]) return;

    const item = batchStatus[idx];

    // Set to pending
    setBatchStatus((prev) =>
      prev.map((statusItem, i) =>
        i === idx
          ? ({ ...statusItem, status: 'pending', message: '' } as T)
          : statusItem
      )
    );

    const frameworkCode = framework?.code;
    if (!frameworkCode) {
      setBatchStatus((prev) =>
        prev.map((statusItem, i) =>
          i === idx
            ? ({
                ...statusItem,
                status: 'failed',
                message: 'Missing framework code',
              } as T)
            : statusItem
        )
      );
      return;
    }

    try {
      await retryFunction(
        {
          name: item.name,
          code: item.code,
          description: item.description,
        },
        frameworkCode
      );

      // Call success callback
      onSuccess(item);

      setBatchStatus((prev) =>
        prev.map((statusItem, i) =>
          i === idx
            ? ({
                ...statusItem,
                status: 'success',
                message: 'Successfully created',
              } as T)
            : statusItem
        )
      );
    } catch (err: unknown) {
      let msg = 'Failed to create item';
      if (err instanceof Error) msg = err.message;

      setBatchStatus((prev) =>
        prev.map((statusItem, i) =>
          i === idx
            ? ({ ...statusItem, status: 'failed', message: msg } as T)
            : statusItem
        )
      );
    }
  };

  return { handleRetry };
}

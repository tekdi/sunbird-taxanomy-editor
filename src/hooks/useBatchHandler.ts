import { useState } from 'react';
import { Framework } from '@/interfaces/FrameworkInterface';

interface BatchItem {
  name: string;
  code: string;
  description: string;
  [key: string]: unknown;
}

interface BatchResult<T> {
  status: 'success' | 'failed';
  message: string;
  category?: T;
  item?: T;
  [key: string]: unknown;
}

interface BatchStatus {
  name: string;
  code: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
}

interface ModalStatus {
  name: string;
  code: string;
  description: string;
  status: 'pending' | 'success' | 'failed';
  message?: string;
}

/**
 * Reusable hook for handling batch creation logic
 * Eliminates code duplication between useStepCategory and useStepTerms
 */
export function useBatchHandler<T extends BatchItem, R extends BatchResult<T>>(
  pendingItems: T[],
  setPendingItems: React.Dispatch<React.SetStateAction<T[]>>,
  batchStatus: BatchStatus[],
  setBatchStatus: React.Dispatch<React.SetStateAction<BatchStatus[]>>,
  framework: Partial<Framework> | null,
  batchCreateFunction: (items: T[], frameworkCode: string) => Promise<R[]>,
  onSuccess: (result: R) => void
) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatuses, setModalStatuses] = useState<ModalStatus[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState<number>(0);

  const handleBatchCreate = async () => {
    setModalOpen(true);
    setBatchStatus([]);
    setModalStatuses(
      pendingItems.map((item) => ({
        name: item.name,
        code: item.code,
        description: item.description,
        status: 'pending',
      }))
    );
    setCurrentModalIndex(0);

    const frameworkCode = framework?.code;
    if (!frameworkCode) {
      const failedStatus = pendingItems.map((item) => ({
        name: item.name,
        code: item.code,
        description: item.description,
        status: 'failed' as const,
        message: 'Missing framework code',
      }));

      setModalStatuses(failedStatus);

      setTimeout(() => {
        setModalOpen(false);
        setBatchStatus(failedStatus as BatchStatus[]);
        setPendingItems([]);
      }, 1200);
      return;
    }

    try {
      const results = await batchCreateFunction(pendingItems, frameworkCode);

      // Update modal statuses and call success callbacks
      results.forEach((result, i) => {
        setCurrentModalIndex(i);
        if (result.status === 'success') {
          onSuccess(result);
        }
      });

      setTimeout(() => {
        setModalOpen(false);
        setBatchStatus(
          results.map((result) => {
            // Handle both category and item properties for flexibility
            const item = result.category ?? result.item ?? result;
            return {
              name: item.name,
              code: item.code,
              description: item.description,
              status: result.status,
              message: result.message,
            };
          }) as BatchStatus[]
        );
        setPendingItems([]);
      }, 1200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Batch creation failed';
      const failedStatus = pendingItems.map((item) => ({
        name: item.name,
        code: item.code,
        description: item.description,
        status: 'failed' as const,
        message: errorMessage,
      }));

      setTimeout(() => {
        setModalOpen(false);
        setBatchStatus(failedStatus as BatchStatus[]);
        setPendingItems([]);
      }, 1200);
    }
  };

  return {
    modalOpen,
    setModalOpen,
    modalStatuses,
    setModalStatuses,
    currentModalIndex,
    setCurrentModalIndex,
    handleBatchCreate,
  };
}

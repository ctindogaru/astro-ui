import { useRouter } from 'next/router';
import { useCallback } from 'react';

const useQuery = <T>(): {
  query: T;
  updateQuery: <K extends keyof T>(key: K, value: T[K]) => void;
} => {
  const { query, replace } = useRouter();

  const updateQuery = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const nextQuery = {
        ...query,
        [key]: String(value),
      };

      if (!value) {
        delete nextQuery[key as string];
      }

      replace({ query: nextQuery }, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [query, replace]
  );

  return { query: (query as unknown) as T, updateQuery };
};

export default useQuery;

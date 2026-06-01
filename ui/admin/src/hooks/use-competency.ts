import { get } from '@/lib/api';
import type { PaginationParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const competencyKeys = {
  all: ['competency-domain'] as const,
  lists: () => [...competencyKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...competencyKeys.lists(), params] as const,
  details: () => [...competencyKeys.all, 'detail'] as const,
  detail: (id: string) => [...competencyKeys.details(), id] as const
};

export function useCompetencyDomains() {
  return useQuery({
    queryKey: competencyKeys.all,
    queryFn: () => get('/admin/competancy-domain')
  });
}

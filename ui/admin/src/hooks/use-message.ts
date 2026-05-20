import { get } from '@/lib/api';
import type { Message, PaginatedResponse, PaginationParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...messageKeys.lists(), params] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const
};

export function useMessages(params: PaginationParams = {}) {
  return useQuery({
    queryKey: messageKeys.list(params),
    queryFn: () => get<PaginatedResponse<Message>>('/contacts', params as Record<string, unknown>)
  });
}

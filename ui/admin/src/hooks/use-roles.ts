import { get, post } from '@/lib/api';
import { CreateRoleFormValues } from '@/lib/validations';
import { ApiResponse, CertificateResponse, PaginatedResponse, Role, type PaginationParams } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const roleKeys = {
  all: ['role'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const
};

export function useCreateRole() {
  return useMutation({
    mutationFn: (data: CreateRoleFormValues) => post<ApiResponse>(`/admin/roles`, data)
  });
}

export function useRoles(params: PaginationParams = {}) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => get<PaginatedResponse<Role[]>>('/admin/roles', params as Record<string, unknown>)
  });
}

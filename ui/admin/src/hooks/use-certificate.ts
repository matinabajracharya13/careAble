import { get } from '@/lib/api';
import { CertificateResponse, type PaginationParams } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const certificateKeys = {
  all: ['certificate'] as const,
  lists: () => [...certificateKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...certificateKeys.lists(), params] as const,
  details: () => [...certificateKeys.all, 'detail'] as const,
  detail: (id: string) => [...certificateKeys.details(), id] as const
};

export function useVerifyCertificate() {
  return useMutation({
    mutationFn: (code: string) => get<CertificateResponse>(`/certificates/verify/${code}`)
  });
}

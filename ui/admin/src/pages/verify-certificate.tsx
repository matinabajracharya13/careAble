'use client';

import { Award, BadgeCheck, Loader2, Search, ShieldCheck, XCircle } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useVerifyCertificate } from '@/hooks/use-certificate';
import { formatDate } from '@/lib/utils';

export function VerifyCertificatePage() {
  const [certificateCode, setCertificateCode] = useState('');
  const [certificate, setCertificate] = useState<any>(null);

  const verifyMutation = useVerifyCertificate();
  const handleVerify = () => {
    if (!certificateCode.trim()) return;

    verifyMutation.mutate(certificateCode, {
      onSuccess: (data) => {
        setCertificate(data?.data);
      },
      onError: () => {
        setCertificate(null);
      }
    });
  };

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold font-display tracking-tight'>Verify Certificate</h1>

          <p className='text-muted-foreground text-sm mt-1'>Validate certificates using certificate verification code.</p>
        </div>
      </div>

      <Card>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />

              <Input
                placeholder='Enter certificate code...'
                value={certificateCode}
                onChange={(e) => setCertificateCode(e.target.value)}
                className='pl-9'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleVerify();
                  }
                }}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <>
                  <Search className='h-4 w-4' />
                  Verify
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!certificate && (
            <div className='py-12 flex flex-col items-center justify-center text-center text-muted-foreground'>
              <Award className='h-10 w-10 mb-3 opacity-50' />

              <p className='text-sm'>Enter a certificate code to verify authenticity</p>
            </div>
          )}

          {certificate?.valid === true && (
            <div className='rounded-xl border border-green-500/20 bg-green-500/5 p-5 space-y-5 animate-fade-in'>
              {/* Header */}
              <div className='flex items-start gap-4'>
                <div className='h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0'>
                  <ShieldCheck className='h-6 w-6 text-green-600' />
                </div>

                <div className='space-y-1'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h3 className='text-lg font-semibold'>Certificate Verified</h3>

                    <Badge className='bg-green-500/10 text-green-700 border-green-500/20'>Valid</Badge>
                  </div>

                  <p className='text-sm text-muted-foreground'>This certificate is authentic and valid.</p>
                </div>
              </div>

              {/* Details */}
              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-muted-foreground'>Recipient</p>

                  <p className='font-medium mt-1'>{certificate.user_name}</p>
                </div>

                <div>
                  <p className='text-xs text-muted-foreground'>Assessment</p>

                  <p className='font-medium mt-1'>{certificate.assessment_title}</p>
                </div>

                <div>
                  <p className='text-xs text-muted-foreground'>Certificate ID</p>

                  <p className='font-medium mt-1 font-mono'>{certificate.certificate_code}</p>
                </div>

                <div>
                  <p className='text-xs text-muted-foreground'>Issued At</p>

                  <p className='font-medium mt-1'>{formatDate(certificate.issued_at)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className='pt-3 border-t'>
                <Button>
                  <BadgeCheck className='h-4 w-4' />
                  View Certificate
                </Button>
              </div>
            </div>
          )}

          {certificate?.valid === false && (
            <div className='rounded-xl border border-red-500/20 bg-red-500/5 p-5 animate-fade-in'>
              <div className='flex items-start gap-4'>
                <div className='h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0'>
                  <XCircle className='h-6 w-6 text-red-500' />
                </div>

                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold'>Invalid Certificate</h3>

                    <Badge variant='destructive'>Invalid</Badge>
                  </div>

                  <p className='text-sm text-muted-foreground'>This certificate code could not be verified.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { certificateApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Award, Loader2, Search, ShieldCheck, XCircle } from 'lucide-react';
import { useState } from 'react';

type CertificateResponse = {
  valid: boolean;
  certificate_code?: string;
  user_name?: string;
  assessment_title?: string;
  issued_at?: string | number;
};

export default function VerifyCertificatePage() {
  const [certificateCode, setCertificateCode] = useState('');
  const [result, setResult] = useState<CertificateResponse | null>(null);

  const verifyMutation = useMutation({
    mutationFn: () => certificateApi.verifyCertificate(certificateCode),
    onSuccess: (res) => {
      // adjust if API wraps data in {data: ...}
      setResult(res?.data ?? res);
    },
    onError: () => {
      setResult({ valid: false });
    }
  });

  const handleVerify = () => {
    if (!certificateCode.trim()) return;
    verifyMutation.mutate();
  };

  const isValid = result?.valid;

  return (
    <div className='min-h-screen bg-background pt-20 pb-12'>
      <div className='container mx-auto px-4 max-w-3xl'>
        {/* Header */}
        <div className='mb-10 text-center space-y-4 animate-fade-in'>
          <div className='mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center'>
            <Award className='h-8 w-8 text-primary' />
          </div>

          <div className='space-y-2'>
            <Badge className='bg-primary/10 text-primary border-primary/20'>Certificate Verification</Badge>

            <h1 className='text-4xl font-display font-bold'>Verify a Certificate</h1>

            <p className='text-muted-foreground max-w-xl mx-auto'>Enter certificate code to verify authenticity instantly.</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className='p-6 space-y-5'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Certificate Code</label>

              <div className='flex flex-col sm:flex-row gap-3'>
                <Input
                  placeholder='e.g CERT-XXXX-XXXX'
                  value={certificateCode}
                  onChange={(e) => setCertificateCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />

                <Button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                  className='sm:w-auto w-full'
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
            </div>

            {/* RESULT */}
            {verifyMutation.isSuccess && result && (
              <>
                {isValid ? (
                  <div className='rounded-2xl border border-green-500/20 bg-green-500/5 p-5 space-y-5'>
                    <div className='flex items-start gap-4'>
                      <div className='h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center'>
                        <ShieldCheck className='h-6 w-6 text-green-600' />
                      </div>

                      <div>
                        <h3 className='text-lg font-semibold flex items-center gap-2'>
                          Certificate Verified
                          <Badge className='bg-green-500/10 text-green-700 border-green-500/20'>Valid</Badge>
                        </h3>
                        <p className='text-sm text-muted-foreground'>This certificate is authentic.</p>
                      </div>
                    </div>

                    <div className='grid sm:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <p className='text-muted-foreground'>Recipient</p>
                        <p className='font-medium'>{result.user_name}</p>
                      </div>

                      <div>
                        <p className='text-muted-foreground'>Assessment</p>
                        <p className='font-medium'>{result.assessment_title}</p>
                      </div>

                      <div>
                        <p className='text-muted-foreground'>Issued At</p>
                        <p className='font-medium'>{result.issued_at ? new Date(result.issued_at).toLocaleDateString() : '-'}</p>
                      </div>

                      <div>
                        <p className='text-muted-foreground'>Code</p>
                        <p className='font-medium'>{result.certificate_code}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='rounded-2xl border border-red-500/20 bg-red-500/5 p-5'>
                    <div className='flex items-start gap-4'>
                      <XCircle className='h-6 w-6 text-red-500' />

                      <div>
                        <h3 className='text-lg font-semibold'>Invalid Certificate</h3>
                        <p className='text-sm text-muted-foreground'>No matching certificate found.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

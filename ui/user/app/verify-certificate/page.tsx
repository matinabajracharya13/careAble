'use client';

import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { assessmentApi, certificateApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Award, BadgeCheck, ChevronRight, Loader2, Search, ShieldCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function VerifyCertificatePage() {
  const [certificateCode, setCertificateCode] = useState('');
  const [certificate, setCertificate] = useState<any>(null);

  const verifyCertificateMutation = useMutation({
    mutationFn: () => certificateApi.verifyCertificate(certificateCode),
    onSuccess: (data) => {
      setCertificate(data);
    },
    onError: () => {
      setCertificate(null);
    }
  });
  const handleVerify = () => {
    if (!certificateCode.trim()) return;

    verifyCertificateMutation.mutate();
  };

  const isValid = certificate?.valid;

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

            <p className='text-muted-foreground max-w-xl mx-auto'>
              Enter the certificate verification code to validate authenticity and view certificate details.
            </p>
          </div>
        </div>

        {/* Search Card */}
        <Card className='animate-fade-in'>
          <CardContent className='p-6 space-y-5'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Certificate Code ID</label>

              <div className='flex flex-col sm:flex-row gap-3'>
                <Input
                  placeholder='e.g CERT-8X92-KLM2'
                  value={certificateCode}
                  onChange={(e) => setCertificateCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerify();
                    }
                  }}
                />

                <Button
                  onClick={handleVerify}
                  disabled={verifyCertificateMutation.isPending}
                  className='sm:w-auto w-full'
                >
                  {verifyCertificateMutation.isPending ? (
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

            {/* Result */}
            {verifyCertificateMutation.isSuccess && (
              <>
                {isValid ? (
                  <div className='rounded-2xl border border-green-500/20 bg-green-500/5 p-5 space-y-5'>
                    {/* Top */}
                    <div className='flex items-start gap-4'>
                      <div className='h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0'>
                        <ShieldCheck className='h-6 w-6 text-green-600' />
                      </div>

                      <div className='space-y-1'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <h3 className='text-lg font-semibold'>Certificate Verified</h3>

                          <Badge className='bg-green-500/10 text-green-700 border-green-500/20'>Valid</Badge>
                        </div>

                        <p className='text-sm text-muted-foreground'>This certificate is authentic and issued by your platform.</p>
                      </div>
                    </div>

                    {/* Certificate Detail */}
                    <div className='grid sm:grid-cols-2 gap-4 text-sm'>
                      <div className='space-y-1'>
                        <p className='text-muted-foreground'>Recipient</p>
                        <p className='font-medium'>{certificate.user_name}</p>
                      </div>

                      <div className='space-y-1'>
                        <p className='text-muted-foreground'>Assessment</p>
                        <p className='font-medium'>{certificate.assessment_title}</p>
                      </div>

                      <div className='space-y-1'>
                        <p className='text-muted-foreground'>Issued Date</p>
                        <p className='font-medium'>{certificate.issued_at}</p>
                      </div>

                      <div className='space-y-1'>
                        <p className='text-muted-foreground'>Certificate ID</p>
                        <p className='font-medium'>{certificate.certificate_code}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    {/* <div className='pt-2'>
                      <Link href={`/certificate/${certificate.certificate_code}`}>
                        <Button>
                          View Certificate Detail
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      </Link>
                    </div> */}
                  </div>
                ) : (
                  <div className='rounded-2xl border border-red-500/20 bg-red-500/5 p-5'>
                    <div className='flex items-start gap-4'>
                      <div className='h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0'>
                        <XCircle className='h-6 w-6 text-red-500' />
                      </div>

                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-lg font-semibold'>Invalid Certificate</h3>

                          <Badge variant='destructive'>Invalid</Badge>
                        </div>

                        <p className='text-sm text-muted-foreground'>
                          The certificate code could not be verified. Please check the code and try again.
                        </p>
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

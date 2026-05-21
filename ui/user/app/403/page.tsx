'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/ui-components';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <Card className='w-full max-w-md animate-fade-in border-red-500/20'>
        <CardContent className='p-8 text-center space-y-6'>
          {/* Icon */}
          <div className='mx-auto h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center'>
            <ShieldAlert className='h-8 w-8 text-red-500' />
          </div>

          {/* Text */}
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold font-display'>403</h1>
            <h2 className='text-lg font-semibold'>Access Forbidden</h2>

            <p className='text-sm text-muted-foreground'>
              You don’t have permission to access this page. Please contact your administrator if you think this is a mistake.
            </p>
          </div>

          {/* Actions */}
          <div className='flex flex-col gap-3'>
            <Button
              onClick={() => router.back()}
              variant='outline'
            >
              <ArrowLeft className='h-4 w-4' />
              Go Back
            </Button>

            <Button onClick={() => router.push('/')}>
              <Home className='h-4 w-4' />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

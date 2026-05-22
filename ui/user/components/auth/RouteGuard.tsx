'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export function RoleGuard({ children, allowedRoles }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user?.onboarding_completed) {
      router.replace('/onboarding');
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace('/403');
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-6'>
          {/* Animated ring loader */}
          <div className='relative h-14 w-14'>
            <div className='absolute inset-0 rounded-full border-2 border-muted' />
            <div className='absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin' />
          </div>

          {/* Text */}
          <div className='text-center space-y-1'>
            <p className='text-sm font-medium'>Authenticating</p>
            <p className='text-xs text-muted-foreground'>Securing your session...</p>
          </div>

          {/* Skeleton UI hint */}
          <div className='space-y-2 w-72'>
            <div className='h-3 bg-muted rounded w-full animate-pulse' />
            <div className='h-3 bg-muted rounded w-4/5 animate-pulse' />
            <div className='h-3 bg-muted rounded w-2/3 animate-pulse' />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold'>Invalid link</h1>
        <p className='text-muted-foreground text-sm'>This reset link is missing or invalid.</p>
        <Link href='/forgot-password' className='text-primary underline text-sm'>Request a new one</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ variant: 'destructive', title: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ variant: 'success', title: 'Password reset!', description: 'You can now log in with your new password.' });
      router.push('/login');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md w-full space-y-6'>
      <div className='text-center space-y-1'>
        <h1 className='text-2xl font-bold'>Reset your password</h1>
        <p className='text-muted-foreground text-sm'>Choose a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>New password</label>
          <input
            type='password'
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Min. 8 characters'
            className='w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='space-y-1'>
          <label className='text-sm font-medium'>Confirm new password</label>
          <input
            type='password'
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder='Repeat your password'
            className='w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

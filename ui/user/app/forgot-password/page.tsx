'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSent(true);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='max-w-md w-full text-center space-y-4'>
          <h1 className='text-2xl font-bold'>Check your email</h1>
          <p className='text-muted-foreground'>
            If <span className='font-semibold text-foreground'>{email}</span> is registered, a reset link has been sent.
          </p>
          <Link href='/login' className='text-primary underline text-sm'>Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md w-full space-y-6'>
        <div className='text-center space-y-1'>
          <h1 className='text-2xl font-bold'>Forgot your password?</h1>
          <p className='text-muted-foreground text-sm'>Enter your email and we'll send you a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-sm font-medium'>Email address</label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              className='w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground'>
          Remembered it? <Link href='/login' className='text-primary underline'>Back to login</Link>
        </p>
      </div>
    </div>
  );
}

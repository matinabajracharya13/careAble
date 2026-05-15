'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Try refreshing the page.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-muted-foreground">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Go to dashboard
          </Button>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}

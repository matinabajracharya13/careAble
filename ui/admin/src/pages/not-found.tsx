import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SearchX className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

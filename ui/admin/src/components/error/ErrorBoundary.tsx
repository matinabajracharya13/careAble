import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Something went wrong</h1>
              <p className="text-muted-foreground text-sm">
                An unexpected error occurred. Try refreshing the page.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go to dashboard
              </Button>
              <Button onClick={() => this.setState({ hasError: false, error: null })}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

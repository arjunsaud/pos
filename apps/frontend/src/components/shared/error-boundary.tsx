'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { homePath } from '@/lib/navigation/routes';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoToDashboard = (): void => {
    const { user } = useAuthStore.getState();
    if (user) {
      window.location.assign(homePath(user.role));
    }
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
          <Card className="w-full max-w-lg border-destructive/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription className="mt-1.5">
                An unexpected error occurred while rendering this page. Please try again or navigate back to your dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {this.state.error && (
                <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground font-mono leading-relaxed">
                  <code>{this.state.error.message}</code>
                </pre>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="outline" onClick={this.handleReset} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoToDashboard} className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

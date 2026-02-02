import React from 'react';

interface State {
  hasError: boolean;
  error?: any;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="bg-card border border-border rounded-xl p-8 max-w-2xl">
            <h2 className="text-2xl font-semibold text-destructive mb-4">Une erreur est survenue</h2>
            <p className="text-sm text-muted-foreground mb-4">L'application a rencontré une erreur. Vérifiez la console pour les détails.</p>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

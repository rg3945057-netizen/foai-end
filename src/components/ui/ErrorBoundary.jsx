import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-space-900 flex items-center justify-center p-6">
          <div className="glass-card p-10 max-w-md w-full flex flex-col items-center text-center gap-5">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white mb-2">Application Error</h1>
              <p className="text-sm text-gray-400">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

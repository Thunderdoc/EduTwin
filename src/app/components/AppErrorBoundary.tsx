import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State { hasError: boolean; reference: string }

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, reference: '' };

  static getDerivedStateFromError(): State {
    return { hasError: true, reference: `EF-${Date.now().toString(36).toUpperCase()}` };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const event = { level: 'error', message: error.message, componentStack: info.componentStack, at: new Date().toISOString() };
    try {
      const previous = JSON.parse(localStorage.getItem('eduflow_error_log') || '[]');
      localStorage.setItem('eduflow_error_log', JSON.stringify([...previous, event].slice(-20)));
    } catch { /* The recovery UI must work even if storage is unavailable. */ }
    console.error('EduFlow rendering error', event);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><section className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg" role="alert"><h1 className="text-2xl font-bold">This page needs a fresh start</h1><p className="mt-3 text-slate-600">Your saved learning data is safe. Reload the page to continue.</p><p className="mt-2 text-xs text-slate-400">Reference {this.state.reference}</p><button className="mt-6 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white" onClick={() => window.location.reload()}>Reload EduFlow</button></section></main>;
  }
}

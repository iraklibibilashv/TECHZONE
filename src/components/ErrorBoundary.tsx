import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#090d16] px-4 text-white">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101622] p-8 text-center shadow-xl">
            <div className="mb-5 text-5xl">⚠️</div>

            <h1 className="text-2xl font-bold">Something Went Wrong</h1>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              An unexpected error occurred. Please try again.
            </p>

            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

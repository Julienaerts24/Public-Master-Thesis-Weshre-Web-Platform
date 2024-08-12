import React, { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
  errorMessage?: string;
};

type State = {
  hasError: boolean;
};

class ErrorBoundaryCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const { errorMessage = "An unexpected error has occurred" } = this.props;

    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex justify-center items-center bg-red-500 opacity-50" style={{ borderRadius: 35 }}>
          <div className="text-white">{errorMessage}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryCard;

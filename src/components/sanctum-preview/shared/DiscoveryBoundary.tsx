"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type DiscoveryBoundaryProps = {
  children: ReactNode;
  onReturn: () => void;
};

type DiscoveryBoundaryState = {
  failed: boolean;
};

export class DiscoveryBoundary extends Component<
  DiscoveryBoundaryProps,
  DiscoveryBoundaryState
> {
  state: DiscoveryBoundaryState = { failed: false };

  handleReturn = () => {
    this.setState({ failed: false });
    this.props.onReturn();
  };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Digital Twin discovery]", error, info);
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="discovery-fallback" role="alert">
          <span>Atlas recovery state</span>
          <h3>The model could not finish assembling.</h3>
          <p>
            Your invitation remains intact. Return to the preview introduction
            or continue through the surrounding invitation.
          </p>
          <button type="button" onClick={this.handleReturn}>
            Return to introduction
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

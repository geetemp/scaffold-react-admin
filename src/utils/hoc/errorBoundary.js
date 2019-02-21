import React from "react";

export default function errorBoundary(FallbackUI) {
  return class extends React.Component {
    state = { hasError: false };

    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true });
      // You can also log the error to an error reporting service
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <FallbackUI />;
      }

      return this.props.children;
    }
  };
}

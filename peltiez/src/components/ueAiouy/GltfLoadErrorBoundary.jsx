import { Component } from "react";

/** Remonte les erreurs de chargement glTF ; passez une `key` React différente sur ce boundary pour réinitialiser. */
export class GltfLoadErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

import React from "react";
import { View, Text } from "react-native";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log("Error atrapado en ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "red", fontSize: 16 }}>
            Ocurrió un error inesperado 😢
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

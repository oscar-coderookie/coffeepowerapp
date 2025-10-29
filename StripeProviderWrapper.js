// StripeProviderWrapper.js
import { Platform } from 'react-native';
import React from 'react';

let StripeProvider;

if (Platform.OS !== 'web') {
  // Solo importa Stripe en móvil
  StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
} else {
  // En web, crea un componente falso
  StripeProvider = ({ children }) => <>{children}</>;
}

export default StripeProvider;
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import CustomSplash from './src/components/CustomSplash';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <CustomSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Provider store={store}>
      <AppNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}
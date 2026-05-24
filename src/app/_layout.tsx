import React from 'react';
import { AudioProvider } from '../stores/AudioContext';
import HomeScreen from './index';

export default function RootLayout() {
  return (
    <AudioProvider>
      <HomeScreen />
    </AudioProvider>
  );
}

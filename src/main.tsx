import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Capacitor plugins
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

// Configure native plugins on mobile
if (Capacitor.isNativePlatform()) {
  // Configure status bar
  StatusBar.setStyle({ style: Style.Light }).catch(() => {
    // Status bar not available on this platform
  });
  
  StatusBar.setBackgroundColor({ color: '#1a1a1a' }).catch(() => {
    // Status bar background not available on this platform
  });

  // Hide splash screen when app is ready
  SplashScreen.hide().catch(() => {
    // Splash screen not available
  });
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

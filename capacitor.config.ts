
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.61073770c05e439783b8e4fb27f43102',
  appName: 'growup-tahdeef-app',
  webDir: 'dist',
  server: {
    url: 'https://61073770-c05e-4397-83b8-e4fb27f43102.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // إعدادات إضافية لتحسين تجربة التطبيق
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
    },
  }
};

export default config;

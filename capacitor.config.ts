import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'work-notification',
  webDir: 'dist/work-notification',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    BiometricAuth: {
      enabled: true,
    }
  }
};

export default config;

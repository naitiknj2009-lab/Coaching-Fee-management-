import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coachingfeemanager.app',
  appName: 'Coaching Fee Manager',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

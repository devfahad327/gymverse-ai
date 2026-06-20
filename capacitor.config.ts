import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devfahad327.gymverse',
  appName: 'GymVerse AI',
  webDir: 'out',
  server: {
    url: 'https://gymverse-ai.vercel.app',
    cleartext: false,
  },
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dongasteel.dapda',
  appName: 'DA PDA',
  webDir: 'dist',
  server: {
    url: 'http://pda.dongasteel.co.kr:3000',
    cleartext: true
  }  
};

export default config;

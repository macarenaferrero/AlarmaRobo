import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alarma.robo',
  appName: 'AlarmaRobo',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
		  backgroundColor: "#EC865E",
		  androidSplashResourceName: "splash",
		  androidScaleType: "CENTER_CROP",
		  splashFullScreen: true,
		  splashImmersive: true,
    }
  }
};

export default config;

import { NativeModules } from 'react-native';

interface ConfigModule {
  API_BASE_URL: string;
  ONESIGNAL_APP_ID: string;
}

const { Config } = NativeModules;

export const NativeConfig: ConfigModule = Config || {
  API_BASE_URL: 'http://localhost:3000',
  ONESIGNAL_APP_ID: '',
};

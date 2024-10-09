import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BiometricAuth, BiometryError } from '@aparajita/capacitor-biometric-auth';

const { SecureStoragePlugin } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  constructor() {}

  async isBiometricAvailable(): Promise<boolean> {
    try {
      const result = await BiometricAuth.checkBiometry();
      return result.isAvailable;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  async authenticate(): Promise<boolean> {
    try {
      await BiometricAuth.authenticate({
        reason: 'Please authenticate',
        cancelTitle: 'Cancel',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Use passcode',
      });
      return true;
    } catch (error) {
      if (error instanceof BiometryError) {
        console.error('Biometry authentication failed:', error.message);
      }
      return false;
    }
  }

  async saveToSecureStorage(key: string, value: string): Promise<void> {
    try {
      await SecureStoragePlugin['set']({ key, value });
      console.log('Data saved to secure storage.');
    } catch (error) {
      console.error('Error saving to secure storage:', error);
    }
  }

  async getFromSecureStorage(key: string): Promise<string | null> {
    try {
      const result = await SecureStoragePlugin['get']({ key });
      return result.value;
    } catch (error) {
      console.error('Error retrieving from secure storage:', error);
      return null;
    }
  }
}

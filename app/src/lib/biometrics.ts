import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricResult = { success: boolean; error?: string };

// Checks the device actually has Face ID/Touch ID hardware with something
// enrolled before ever showing the system prompt — attempting to
// authenticate on a device with neither just errors immediately, and we'd
// rather steer straight to "use passcode instead" in that case.
export async function isBiometricsAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  return LocalAuthentication.isEnrolledAsync();
}

export async function authenticateWithBiometrics(promptMessage: string): Promise<BiometricResult> {
  const available = await isBiometricsAvailable();
  if (!available) {
    return { success: false, error: 'Face ID isn’t set up on this device. Use passcode instead.' };
  }
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    // Every device with Face ID/Touch ID also has a passcode, so allow it
    // as a first-class fallback rather than only via our own separate
    // "Use passcode instead" button.
    disableDeviceFallback: false,
  });
  if (result.success) return { success: true };
  if (result.error === 'user_cancel' || result.error === 'system_cancel') {
    return { success: false };
  }
  return { success: false, error: 'Face ID didn’t recognize you. Try again or use passcode instead.' };
}

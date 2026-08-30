import { Alert, Platform } from 'react-native';

// react-native-web doesn't implement Alert.alert (it's a silent no-op), so a
// success confirmation would appear to do nothing on web — most visibly on
// Post a request, where a tap that "did nothing" invited retaps and duplicate
// rows. Falls back to the browser's native alert() there instead.
export function notify(title: string, message: string, onDismiss?: () => void) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    onDismiss?.();
  } else {
    Alert.alert(title, message, onDismiss ? [{ text: 'OK', onPress: onDismiss }] : undefined);
  }
}

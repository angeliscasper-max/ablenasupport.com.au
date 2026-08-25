import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { Button } from '../../components/Button';
import { BlueprintFrame } from '../../components/BlueprintFrame';
import { FaceIdIcon } from '../../icons';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Unlock'>;

export function UnlockScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [scanning, setScanning] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  const goToMain = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] })
    );
  };

  const scanThenEnter = () => {
    if (scanning) return;
    setScanning(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.35, duration: 380, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 380, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(goToMain, 900);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.center}>
        <View style={styles.brandBlock}>
          <Text style={type.h2}>Ablena Support</Text>
          <Text style={styles.tagline}>Connecting people. Enabling independence.</Text>
        </View>

        <BlueprintFrame style={styles.idBox}>
          <Animated.View style={{ opacity: scanning ? pulse : 1 }}>
            <FaceIdIcon size={52} />
          </Animated.View>
        </BlueprintFrame>

        <Text style={styles.hint}>{scanning ? 'Scanning…' : 'Unlock with Face ID'}</Text>

        <View style={styles.actions}>
          <Button title="Continue" variant="primary" block loading={scanning} onPress={scanThenEnter} />
          <Button title="Use passcode instead" variant="ghost" block onPress={() => navigation.navigate('Passcode')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space[6] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[6] },
  brandBlock: { alignItems: 'center' },
  tagline: { fontSize: 13, opacity: 0.6, marginTop: 4, color: colors.text },
  idBox: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 13, color: '#5d5d60' },
  actions: { width: '100%', gap: 10, marginTop: 10 },
});

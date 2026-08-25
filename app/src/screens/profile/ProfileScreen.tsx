import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme';
import { Card } from '../../components/Card';
import { Tag } from '../../components/Tag';
import { Button } from '../../components/Button';
import { BlueprintFrame } from '../../components/BlueprintFrame';
import { VerificationRow } from '../../components/VerificationRow';
import { verificationChecklist, worker } from '../../data/mock';
import { useAuth } from '../../context/AuthContext';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.body, { paddingTop: insets.top + 24 }]}>
      <View style={styles.header}>
        <BlueprintFrame style={styles.avatar}>
          <Text style={styles.avatarInitial}>{worker.name[0]}</Text>
        </BlueprintFrame>
        <View style={{ flex: 1 }}>
          <Text style={type.h4}>{worker.name}</Text>
          <Pressable onPress={() => navigation.navigate('Reviews')}>
            <Text style={styles.rating}>
              {worker.rating.toFixed(2)} ★ · {worker.reviewCount} reviews
            </Text>
          </Pressable>
          <Tag label="Verified support worker" variant="accent" style={{ marginTop: 4 }} />
        </View>
      </View>

      <Pressable onPress={() => navigation.navigate('GetVerified')}>
        <Card>
          <Text style={type.cardKicker}>Verification status</Text>
          <View>
            {verificationChecklist.map((item, i) => (
              <VerificationRow key={item.label} item={item} isLast={i === verificationChecklist.length - 1} />
            ))}
          </View>
        </Card>
      </Pressable>

      <Card>
        <Text style={type.cardKicker}>This week</Text>
        <Text style={styles.earnings}>{worker.weekEarnings}</Text>
        <Text style={[type.bodySm, { opacity: 0.65 }]}>
          {worker.weekHours} hrs across {worker.weekShifts} shifts
        </Text>
        <Button title="View payout history" variant="secondary" block onPress={() => navigation.navigate('Payments')} />
      </Card>

      <Pressable onPress={() => navigation.navigate('BrowseWorkers')}>
        <Text style={styles.previewLink}>Preview: participant view →</Text>
      </Pressable>

      <Button title="Sign out" variant="secondary" block onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[4] },
  header: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  avatar: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent100 },
  avatarInitial: { fontFamily: type.h2.fontFamily, fontSize: 28, color: colors.accent700 },
  rating: { fontSize: 12, opacity: 0.65, color: colors.text, marginTop: 2 },
  earnings: { fontFamily: type.h2.fontFamily, fontSize: 26, color: colors.text },
  previewLink: { fontSize: 12, color: colors.accent700, textAlign: 'center', marginTop: space[2] },
});

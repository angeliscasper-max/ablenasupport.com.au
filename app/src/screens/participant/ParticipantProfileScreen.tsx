import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme';
import { Button } from '../../components/Button';
import { BlueprintFrame } from '../../components/BlueprintFrame';
import { fetchMyParticipant, Participant } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';

export function ParticipantProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, signOut } = useAuth();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      let cancelled = false;
      fetchMyParticipant(profile.id)
        .then((p) => {
          if (!cancelled) setParticipant(p);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [profile])
  );

  if (loading) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.body, { paddingTop: insets.top + 24 }]}>
      <View style={styles.header}>
        <BlueprintFrame style={styles.avatar}>
          <Text style={styles.avatarInitial}>{profile?.full_name?.[0] ?? '?'}</Text>
        </BlueprintFrame>
        <View style={{ flex: 1 }}>
          <Text style={type.h4}>{profile?.full_name}</Text>
          {participant?.suburb ? <Text style={styles.suburb}>{participant.suburb}</Text> : null}
        </View>
      </View>

      {participant?.bio ? <Text style={[type.bodySm, styles.bio]}>{participant.bio}</Text> : null}

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
  suburb: { fontSize: 12, opacity: 0.65, color: colors.text, marginTop: 2 },
  bio: { opacity: 0.8 },
});

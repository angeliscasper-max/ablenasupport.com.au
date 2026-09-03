import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { VerificationRow } from '../../components/VerificationRow';
import { Button } from '../../components/Button';
import { fetchMyWorkerProfile, fetchMyVerifications, updateVerificationStatus, WorkerVerification } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import { useHideTabBar } from '../../hooks/useHideTabBar';
import { notify } from '../../lib/notify';

export function GetVerifiedScreen() {
  const navigation = useNavigation();
  useHideTabBar();
  const { profile } = useAuth();
  const [checklist, setChecklist] = useState<WorkerVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    if (!profile) return;
    setLoading(true);
    fetchMyWorkerProfile(profile.id)
      .then((me) => (me ? fetchMyVerifications(me.id) : Promise.resolve([])))
      .then(setChecklist)
      .finally(() => setLoading(false));
  }, [profile]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const uploadNext = async () => {
    const next = checklist.find((c) => c.status === 'upload_needed' || c.status === 'not_started');
    if (!next) {
      notify("You're all set", 'Every check is verified or in review.');
      return;
    }
    setUploading(true);
    await updateVerificationStatus(next.id, 'in_review');
    setUploading(false);
    notify('Document received', `${next.label} is now in review.`);
    load();
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Get verified" centered onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <Text style={[type.bodySm, styles.intro]}>
            Complete these checks once — clients see your progress live, so half-finished isn't invisible.
          </Text>
          <View>
            {checklist.map((item, i) => (
              <VerificationRow key={item.id} item={item} isLast={i === checklist.length - 1} />
            ))}
          </View>
          <Button title="Upload next document" variant="primary" block loading={uploading} onPress={uploadNext} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[3] },
  intro: { opacity: 0.7 },
});

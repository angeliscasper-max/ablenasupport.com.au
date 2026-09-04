import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { fetchMyWorkerProfile, fetchWorker, fetchReviewsForWorker, WorkerProfile, Review } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import { useHideTabBar } from '../../hooks/useHideTabBar';

export function ReviewsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  useHideTabBar();
  const { profile } = useAuth();
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const paramWorkerId: string | undefined = route.params?.workerProfileId;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      const resolve = paramWorkerId
        ? fetchWorker(paramWorkerId)
        : profile
          ? fetchMyWorkerProfile(profile.id)
          : Promise.resolve(null);
      resolve
        .then(async (me) => {
          if (cancelled) return;
          setWorkerProfile(me);
          if (!me) return;
          const rows = await fetchReviewsForWorker(me.id);
          if (!cancelled) setReviews(rows);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [paramWorkerId, profile])
  );

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
    : workerProfile?.rating ?? 0;
  const count = reviews.length || workerProfile?.review_count || 0;

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Reviews" onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.summary}>
            <Text style={styles.average}>{average.toFixed(2)}</Text>
            <Text style={[type.bodySm, { opacity: 0.65 }]}>{count} reviews</Text>
          </View>
          {reviews.length === 0 ? (
            <Text style={[type.bodySm, styles.empty]}>No reviews yet.</Text>
          ) : (
            reviews.map((r) => (
              <Card key={r.id}>
                <Text style={type.cardKicker}>
                  {r.author_name} · {'★'.repeat(r.stars)}
                  {'☆'.repeat(5 - r.stars)}
                </Text>
                {r.text ? <Text style={type.cardBody}>{r.text}</Text> : null}
              </Card>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[3] },
  summary: { alignItems: 'center', marginBottom: space[2] },
  average: { fontFamily: type.h2.fontFamily, fontSize: 34, color: colors.text },
  empty: { textAlign: 'center', opacity: 0.6, marginTop: space[8] },
});

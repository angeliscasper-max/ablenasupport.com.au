import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Tag } from '../../components/Tag';
import { Button } from '../../components/Button';
import { BlueprintFrame } from '../../components/BlueprintFrame';
import { fetchWorker, findOrCreateConversation, fetchReviewsForWorker, WorkerProfile, Review } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../lib/notify';

export function WorkerDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { profile } = useAuth();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchWorker(route.params.workerId)
      .then((w) => {
        if (cancelled || !w) return;
        setWorker(w);
        return fetchReviewsForWorker(w.id).then((rows) => {
          if (!cancelled) setReviews(rows);
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [route.params.workerId]);

  const rating = worker
    ? reviews.length
      ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
      : worker.rating
    : 0;
  const reviewCount = worker ? reviews.length || worker.review_count : 0;

  const messageWorker = async () => {
    if (!worker || !profile) return;
    if (!worker.profile_id) {
      notify('Messaging unavailable', "This is a demo profile without a real account, so it can't be messaged yet.");
      return;
    }
    const convo = await findOrCreateConversation({
      workerProfileId: worker.profile_id,
      workerName: worker.name,
      participantProfileId: profile.id,
      participantName: profile.full_name,
    });
    const parent = navigation.getParent();
    const routeNames: string[] = parent?.getState()?.routeNames ?? [];
    const tabName = routeNames.includes('MessagesTab')
      ? 'MessagesTab'
      : routeNames.includes('ParticipantMessagesTab')
        ? 'ParticipantMessagesTab'
        : null;
    if (tabName) parent.navigate(tabName, { screen: 'Conversation', params: { conversationId: convo.id } });
  };

  if (loading || !worker) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Worker profile" centered onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <BlueprintFrame style={styles.photo}>
          <Text style={styles.photoInitial}>{worker.name[0]}</Text>
        </BlueprintFrame>

        <View>
          <Text style={type.h3}>{worker.name}</Text>
          <Pressable onPress={() => navigation.navigate('Reviews', { workerProfileId: worker.id })}>
            <Text style={styles.rating}>
              {rating.toFixed(2)} ★ · {reviewCount} reviews · {worker.availability}
            </Text>
          </Pressable>
        </View>

        <Text style={[type.bodySm, styles.bio]}>{worker.bio || 'No bio yet.'}</Text>

        <View>
          <Text style={type.h6}>Skills</Text>
          <View style={styles.tagRow}>
            {worker.skills.length ? (
              worker.skills.map((s) => <Tag key={s} label={s} variant="outline" />)
            ) : (
              <Text style={type.bodySm}>Not listed yet.</Text>
            )}
          </View>
        </View>

        <Button title="Message" variant="primary" block onPress={messageWorker} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[4] },
  photo: { width: '100%', height: 170, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent100 },
  photoInitial: { fontFamily: type.h1.fontFamily, fontSize: 48, color: colors.accent700 },
  rating: { fontSize: 12, opacity: 0.65, color: colors.text, marginTop: 4 },
  bio: { opacity: 0.8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});

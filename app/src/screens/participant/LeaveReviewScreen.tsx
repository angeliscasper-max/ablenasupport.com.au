import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { submitReview } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../lib/notify';
import type { RequestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RequestsStackParamList, 'LeaveReview'>;

export function LeaveReviewScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { applicationId, workerProfileId, workerName } = route.params;
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!profile) return;
    setSubmitting(true);
    const { error } = await submitReview({
      applicationId,
      workerProfileId,
      authorProfileId: profile.id,
      authorName: profile.full_name,
      stars,
      text: text.trim(),
    });
    setSubmitting(false);
    if (error) {
      notify("Couldn't submit review", error);
      return;
    }
    notify('Review posted', `Thanks for reviewing ${workerName}.`, () => navigation.goBack());
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={`Review ${workerName}`} centered onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setStars(n)} hitSlop={8}>
              <Text style={styles.star}>{n <= stars ? '★' : '☆'}</Text>
            </Pressable>
          ))}
        </View>
        <TextField
          label="Comments (optional)"
          placeholder="How did the shift go?"
          multiline
          value={text}
          onChangeText={setText}
        />
        <Button title="Post review" variant="primary" block loading={submitting} onPress={submit} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[3] },
  starRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: space[2] },
  star: { fontSize: 36, color: colors.accent },
});

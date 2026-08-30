import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { fetchMyParticipant, createShift } from '../../data/queries';
import { useAuth } from '../../context/AuthContext';
import type { RequestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RequestsStackParamList, 'PostShift'>;

export function PostShiftScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [dayLabel, setDayLabel] = useState('');
  const [timeLabel, setTimeLabel] = useState('');
  const [rate, setRate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!profile) return;
    if (!category.trim() || !title.trim() || !description.trim() || !dayLabel.trim() || !timeLabel.trim() || !rate.trim()) {
      setError('Fill in every field before posting.');
      return;
    }
    setLoading(true);
    const me = await fetchMyParticipant(profile.id);
    if (!me) {
      setLoading(false);
      setError("Couldn't find your participant profile.");
      return;
    }
    const { error: createError } = await createShift(me.id, {
      category: category.trim(),
      title: title.trim(),
      description: description.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      day_label: dayLabel.trim(),
      time_label: timeLabel.trim(),
      rate: rate.trim(),
    });
    setLoading(false);
    if (createError) {
      setError(createError);
      return;
    }
    Alert.alert('Posted', 'Your request is now visible to support workers.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ScreenHeader title="Post a request" centered onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <TextField label="Category" placeholder="Personal care" value={category} onChangeText={setCategory} />
        <TextField label="Title" placeholder="Morning routine" value={title} onChangeText={setTitle} />
        <TextField
          label="Description"
          placeholder="What does the shift involve?"
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <TextField
          label="Skills needed (comma-separated)"
          placeholder="Manual handling, Meal prep"
          value={tags}
          onChangeText={setTags}
        />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextField label="Day" placeholder="Tue" value={dayLabel} onChangeText={setDayLabel} />
          </View>
          <View style={{ flex: 1 }}>
            <TextField label="Time" placeholder="7:00–9:00am" value={timeLabel} onChangeText={setTimeLabel} />
          </View>
        </View>
        <TextField label="Rate" placeholder="$58.20/hr" value={rate} onChangeText={setRate} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Post request" variant="primary" block loading={loading} onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[3] },
  row: { flexDirection: 'row', gap: space[3] },
  error: { color: '#b3261e', fontSize: 12 },
});

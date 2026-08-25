import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SegmentedControl } from '../../components/SegmentedControl';
import { ShiftCard } from '../../components/ShiftCard';
import { BellIcon } from '../../icons';
import { fetchShifts, Shift } from '../../data/queries';
import type { FeedStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'Feed'>;

const TABS = ['For you', 'Nearby', 'Saved'] as const;

export function FeedScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('For you');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      fetchShifts()
        .then((rows) => {
          if (!cancelled) setShifts(rows);
        })
        .catch((e) => {
          if (!cancelled) setError(e instanceof Error ? e.message : String(e));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const data = useMemo(() => {
    if (tab === 'Saved') return [];
    if (tab === 'Nearby') return [...shifts].sort((a, b) => a.distance_km - b.distance_km);
    return shifts;
  }, [tab, shifts]);

  return (
    <View style={styles.screen}>
      <ScreenHeader brand="Ablena Support" right={<BellIcon />} />
      <View style={styles.segWrap}>
        <SegmentedControl options={TABS} value={tab} onChange={setTab} />
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : error ? (
        <Text style={[type.bodySm, styles.empty]}>Couldn't load shifts: {error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={[type.bodySm, styles.empty]}>No saved shifts yet.</Text>}
          renderItem={({ item }) => (
            <ShiftCard shift={item} onPress={() => navigation.navigate('MatchDetail', { shiftId: item.id })} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  segWrap: { paddingHorizontal: space[4], paddingTop: space[3], paddingBottom: space[1] },
  list: { padding: space[4], gap: space[3] },
  empty: { textAlign: 'center', opacity: 0.6, marginTop: space[8] },
});

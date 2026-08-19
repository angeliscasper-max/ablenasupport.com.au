import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SegmentedControl } from '../../components/SegmentedControl';
import { ShiftCard } from '../../components/ShiftCard';
import { BellIcon } from '../../icons';
import { feedShifts } from '../../data/mock';
import type { FeedStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'Feed'>;

const TABS = ['For you', 'Nearby', 'Saved'] as const;

export function FeedScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('For you');

  const data = useMemo(() => {
    if (tab === 'Saved') return [];
    if (tab === 'Nearby') return [...feedShifts].sort((a, b) => a.distanceKm - b.distanceKm);
    return feedShifts;
  }, [tab]);

  return (
    <View style={styles.screen}>
      <ScreenHeader brand="Ablena Support" right={<BellIcon />} />
      <View style={styles.segWrap}>
        <SegmentedControl options={TABS} value={tab} onChange={setTab} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={[type.bodySm, styles.empty]}>No saved shifts yet.</Text>}
        renderItem={({ item }) => (
          <ShiftCard shift={item} onPress={() => navigation.navigate('MatchDetail', { shiftId: item.id })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  segWrap: { paddingHorizontal: space[4], paddingTop: space[3], paddingBottom: space[1] },
  list: { padding: space[4], gap: space[3] },
  empty: { textAlign: 'center', opacity: 0.6, marginTop: space[8] },
});

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SearchIcon } from '../../icons';
import { fetchWorkers, WorkerProfile } from '../../data/queries';
import { useHideTabBar } from '../../hooks/useHideTabBar';

// Reused from two places: the worker's own Profile screen ("Preview:
// participant view" link) and the participant's real Browse tab.
export function BrowseWorkersScreen() {
  const navigation = useNavigation<any>();
  // Root of its own stack (the participant's Browse tab) -> keep the tab
  // bar. Pushed on top of something else (the worker's Profile "preview"
  // link) -> hide it, matching every other pushed screen in that stack.
  const isRoot = navigation.getState()?.index === 0;
  useHideTabBar(!isRoot);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      fetchWorkers()
        .then((rows) => {
          if (!cancelled) setWorkers(rows);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        brand="Find a worker"
        onBack={isRoot ? undefined : () => navigation.goBack()}
        right={<SearchIcon />}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: space[8] }} color={colors.accent} />
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(w) => w.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card elevated>
              <Text style={type.cardKicker}>
                {item.category.toUpperCase()} · {item.availability.toUpperCase()}
              </Text>
              <Text style={type.cardTitle}>{item.name}</Text>
              <Text style={type.cardBody}>
                {item.rating.toFixed(2)} ★ · {item.review_count} reviews · {item.skills.join(', ')}
              </Text>
              <Button
                title="View profile"
                variant="secondary"
                block
                onPress={() => navigation.navigate('WorkerDetail', { workerId: item.id })}
              />
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: space[4], gap: space[3] },
});

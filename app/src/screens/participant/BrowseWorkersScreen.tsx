import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Tag } from '../../components/Tag';
import { Button } from '../../components/Button';
import { SearchIcon } from '../../icons';
import { browseWorkers } from '../../data/mock';
import { useHideTabBar } from '../../hooks/useHideTabBar';

// Participant-side preview (screen 11 in the design) — reachable from the
// worker Profile screen as a "Preview: participant view" link. Not part of
// the worker's own navigation flow.
export function BrowseWorkersScreen() {
  const navigation = useNavigation();
  useHideTabBar();

  return (
    <View style={styles.screen}>
      <ScreenHeader brand="Find a worker" onBack={() => navigation.goBack()} right={<SearchIcon />} />
      <FlatList
        data={browseWorkers}
        keyExtractor={(w) => w.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card elevated>
            <View style={styles.topRow}>
              <Text style={type.cardKicker}>
                {item.category.toUpperCase()} · {item.availability.toUpperCase()}
              </Text>
              <Tag label={`${item.match}% match`} variant="accent" />
            </View>
            <Text style={type.cardTitle}>{item.name}</Text>
            <Text style={type.cardBody}>
              {item.rating} ★ · {item.reviewCount} reviews · {item.skills}
            </Text>
            <Button
              title="View profile"
              variant="secondary"
              block
              onPress={() => Alert.alert(item.name, 'Full worker profile view is coming soon.')}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: space[4], gap: space[3] },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
});

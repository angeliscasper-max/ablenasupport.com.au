import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, space, type } from '../../theme';
import { ScreenHeader } from '../../components/ScreenHeader';
import { VerificationRow } from '../../components/VerificationRow';
import { Button } from '../../components/Button';
import { onboardingChecklist as initialChecklist, VerificationItem } from '../../data/mock';
import { useHideTabBar } from '../../hooks/useHideTabBar';

export function GetVerifiedScreen() {
  const navigation = useNavigation();
  useHideTabBar();
  const [checklist, setChecklist] = useState<VerificationItem[]>(initialChecklist);

  const uploadNext = () => {
    const idx = checklist.findIndex((c) => c.status === 'upload_needed' || c.status === 'not_started');
    if (idx === -1) {
      Alert.alert("You're all set", 'Every check is verified or in review.');
      return;
    }
    Alert.alert('Document received', `${checklist[idx].label} is now in review.`);
    setChecklist((prev) => prev.map((c, i) => (i === idx ? { ...c, status: 'in_review' } : c)));
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Get verified" centered onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[type.bodySm, styles.intro]}>
          Complete these checks once — clients see your progress live, so half-finished isn't invisible.
        </Text>
        <View>
          {checklist.map((item, i) => (
            <VerificationRow key={item.label} item={item} isLast={i === checklist.length - 1} />
          ))}
        </View>
        <Button title="Upload next document" variant="primary" block onPress={uploadNext} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: space[4], gap: space[3] },
  intro: { opacity: 0.7 },
});

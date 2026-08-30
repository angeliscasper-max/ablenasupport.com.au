import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

// Screens 07/09/10/11 in the design have no bottom nav bar (they're pushed
// full-screen from within a tab's stack) — this hides the parent
// Tab.Navigator's bar for the lifetime of the screen that calls it.
// `enabled` lets a screen reused as BOTH a tab's root AND a pushed detail
// screen elsewhere (e.g. BrowseWorkersScreen) opt out when it's the root.
export function useHideTabBar(enabled = true) {
  const navigation = useNavigation();
  useEffect(() => {
    if (!enabled) return;
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation, enabled]);
}

import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

// Screens 07/09/10/11 in the design have no bottom nav bar (they're pushed
// full-screen from within a tab's stack) — this hides the parent
// Tab.Navigator's bar for the lifetime of the screen that calls it.
export function useHideTabBar() {
  const navigation = useNavigation();
  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);
}

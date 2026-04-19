import { useCallback, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export function useWeatherTabs() {
  const tabs = useMemo(
    () => [
      {
        key: 'currently',
        title: 'Currently',
        icon: {
          active: 'time',
          inactive: 'time-outline',
        },
      },
      {
        key: 'today',
        title: 'Today',
        icon: {
          active: 'calendar',
          inactive: 'calendar-outline',
        },
      },
      {
        key: 'weekly',
        title: 'Weekly',
        icon: {
          active: 'list',
          inactive: 'list-outline',
        },
      },
    ],
    []
  );

  const renderIcon = useCallback(({ route, focused, color, size }) => {
    return (
      <Ionicons
        name={focused ? route.icon.active : route.icon.inactive}
        size={size}
        color={color}
      />
    );
  }, []);

  return { tabs, renderIcon };
}
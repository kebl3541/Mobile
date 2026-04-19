import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export const weatherTabs = [
  {
    key: 'current',
    title: 'Current',
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
];

export function renderWeatherTabIcon({ route, focused, color, size }) {
  return (
    <Ionicons
      name={focused ? route.icon.active : route.icon.inactive}
      size={size}
      color={color}
    />
  );
}
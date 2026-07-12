import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import { deleteEntry } from '../services/diaryService';
import { useEntries } from '../hooks/useEntries';
import EntryCard from '../components/EntryCard';
import EntryDetailModal from '../components/EntryDetailModal';
import { dateKey, todayKey } from '../utils/format';
import { COLORS, SPACING } from '../constants/theme';

// Ex01: agenda page. A calendar that opens on the current date;
// selecting a day shows a scrollable list of that day's entries.
// Deleting an entry updates the list through the live subscription.
export default function AgendaScreen() {
  const entries = useEntries();
  const [selectedDay, setSelectedDay] = useState(todayKey());
  const [selectedEntry, setSelectedEntry] = useState(null);

  const entriesByDay = useMemo(() => {
    const map = {};
    (entries ?? []).forEach((e) => {
      const key = dateKey(e.date);
      if (!key) return;
      (map[key] = map[key] ?? []).push(e);
    });
    return map;
  }, [entries]);

  const markedDates = useMemo(() => {
    const marks = {};
    Object.keys(entriesByDay).forEach((key) => {
      marks[key] = { marked: true, dotColor: COLORS.accent };
    });
    marks[selectedDay] = {
      ...(marks[selectedDay] ?? {}),
      selected: true,
      selectedColor: COLORS.primary,
    };
    return marks;
  }, [entriesByDay, selectedDay]);

  const handleDelete = async (entry) => {
    await deleteEntry(entry.id);
    setSelectedEntry(null);
  };

  if (entries === null) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const dayEntries = entriesByDay[selectedDay] ?? [];

  return (
    <View style={styles.container}>
      <Calendar
        current={todayKey()}
        onDayPress={(day) => setSelectedDay(day.dateString)}
        markedDates={markedDates}
        theme={{
          calendarBackground: COLORS.surface,
          todayTextColor: COLORS.accent,
          arrowColor: COLORS.primary,
          monthTextColor: COLORS.primary,
          textMonthFontWeight: '700',
        }}
        style={styles.calendar}
      />

      <Text style={styles.dayTitle}>
        {selectedDay} · {dayEntries.length}{' '}
        {dayEntries.length === 1 ? 'entry' : 'entries'}
      </Text>

      <FlatList
        data={dayEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No entries on this day.</Text>
        }
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => setSelectedEntry(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      <EntryDetailModal
        entry={selectedEntry}
        onDelete={handleDelete}
        onClose={() => setSelectedEntry(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
});

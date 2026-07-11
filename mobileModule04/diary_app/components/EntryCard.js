import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { feelingByKey } from '../constants/feelings';
import { formatDate } from '../utils/format';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function EntryCard({ entry, onPress, onDelete }) {
  const feeling = feelingByKey(entry.feeling);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.feeling}>{feeling.emoji}</Text>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {entry.title}
        </Text>
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  feeling: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  date: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  deleteButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  deleteText: {
    fontSize: 18,
  },
});

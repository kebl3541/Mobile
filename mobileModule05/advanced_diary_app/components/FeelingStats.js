import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { FEELINGS } from '../constants/feelings';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// Percentage of use of each feeling across all entries.
export default function FeelingStats({ entries }) {
  const total = entries.length;

  return (
    <View style={styles.container}>
      {FEELINGS.map((f) => {
        const count = entries.filter((e) => e.feeling === f.key).length;
        const pct = total === 0 ? 0 : Math.round((count / total) * 100);
        return (
          <View key={f.key} style={styles.row}>
            <Text style={styles.emoji}>{f.emoji}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.pct}>{pct}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  emoji: {
    fontSize: 18,
    width: 30,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  pct: {
    width: 44,
    textAlign: 'right',
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
});

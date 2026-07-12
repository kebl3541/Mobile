import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { FEELINGS } from '../constants/feelings';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// Largest-remainder rounding: floor every share, then hand the leftover
// points to the largest fractional parts so the total is exactly 100.
function percentages(entries) {
  const total = entries.length;
  const counts = FEELINGS.map(
    (f) => entries.filter((e) => e.feeling === f.key).length
  );
  if (total === 0) return counts.map(() => 0);
  const exact = counts.map((c) => (c / total) * 100);
  const floored = exact.map(Math.floor);
  let leftover = 100 - floored.reduce((a, b) => a + b, 0);
  const order = exact
    .map((v, i) => ({ frac: v - floored[i], i }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (leftover <= 0) break;
    floored[i] += 1;
    leftover -= 1;
  }
  return floored;
}

// Percentage of use of each feeling across all entries.
export default function FeelingStats({ entries }) {
  const pcts = percentages(entries);

  return (
    <View style={styles.container}>
      {FEELINGS.map((f, idx) => {
        const pct = pcts[idx];
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

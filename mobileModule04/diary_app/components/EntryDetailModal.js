import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { feelingByKey } from '../constants/feelings';
import { formatDate } from '../utils/format';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function EntryDetailModal({ entry, onDelete, onClose }) {
  if (!entry) return null;
  const feeling = feelingByKey(entry.feeling);

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.feelingEmoji}>{feeling.emoji}</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>{entry.title}</Text>
              <Text style={styles.date}>{formatDate(entry.date)}</Text>
              <Text style={styles.feelingLabel}>Feeling: {feeling.label}</Text>
            </View>
          </View>

          <ScrollView style={styles.contentScroll}>
            <Text style={styles.content}>{entry.text}</Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(entry)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  feelingEmoji: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  date: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  feelingLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  contentScroll: {
    flexGrow: 0,
    marginBottom: SPACING.md,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  closeText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

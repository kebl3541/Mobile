import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { createEntry, deleteEntry } from '../services/diaryService';
import { useEntries } from '../hooks/useEntries';
import { showError } from '../utils/alert';
import EntryCard from '../components/EntryCard';
import NewEntryModal from '../components/NewEntryModal';
import EntryDetailModal from '../components/EntryDetailModal';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// Ex01: the profile page. Lists the user's diary entries live from
// Firestore; supports create, read (tap a card) and delete.
export default function ProfileScreen() {
  const { user } = useAuth();
  const entries = useEntries();
  const [creating, setCreating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleCreate = async ({ title, feeling, text }) => {
    await createEntry({ usermail: user.email, title, feeling, text });
    setCreating(false);
  };

  const handleDelete = async (entry) => {
    try {
      await deleteEntry(entry.id);
      setSelectedEntry(null);
    } catch (error) {
      showError('Could not delete the entry', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>My Diary</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {entries === null ? (
        <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍂</Text>
          <Text style={styles.emptyText}>No entries yet.</Text>
          <Text style={styles.emptyHint}>Tap + to write your first one.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EntryCard
              entry={item}
              onPress={() => setSelectedEntry(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setCreating(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <NewEntryModal
        visible={creating}
        onSubmit={handleCreate}
        onClose={() => setCreating(false)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerInfo: {
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerEmail: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  loader: {
    marginTop: SPACING.xl * 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: 96,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: {
    color: '#FFF',
    fontSize: 32,
    lineHeight: 36,
  },
});

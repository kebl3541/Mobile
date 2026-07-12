import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { createEntry, deleteEntry } from '../services/diaryService';
import { showError } from '../utils/alert';
import { useEntries } from '../hooks/useEntries';
import EntryCard from '../components/EntryCard';
import FeelingStats from '../components/FeelingStats';
import NewEntryModal from '../components/NewEntryModal';
import EntryDetailModal from '../components/EntryDetailModal';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// Ex00: profile page. User name, logout, the last 2 entries, entry
// details with delete, total count, feelings percentages and a button
// to add a new entry. Everything updates live via the Firestore
// subscription in useEntries.
export default function ProfileScreen() {
  const { user } = useAuth();
  const entries = useEntries();
  const [creating, setCreating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Diarist';

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

  if (entries === null) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const lastTwo = entries.slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{displayName}</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.totalCard}>
          <Text style={styles.totalNumber}>{entries.length}</Text>
          <Text style={styles.totalLabel}>
            {entries.length === 1 ? 'diary entry' : 'diary entries'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Last 2 entries</Text>
        {lastTwo.length === 0 ? (
          <Text style={styles.emptyText}>No entries yet. Tap + to write one.</Text>
        ) : (
          lastTwo.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onPress={() => setSelectedEntry(entry)}
              onDelete={() => handleDelete(entry)}
            />
          ))
        )}

        <Text style={styles.sectionTitle}>Your feelings</Text>
        <FeelingStats entries={entries} />
      </ScrollView>

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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  headerName: {
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
  scroll: {
    padding: SPACING.md,
    paddingBottom: 96,
  },
  totalCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  totalNumber: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '700',
  },
  totalLabel: {
    color: '#EADFCE',
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: SPACING.sm,
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

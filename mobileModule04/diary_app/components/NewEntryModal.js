import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { FEELINGS } from '../constants/feelings';
import { showError } from '../utils/alert';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function NewEntryModal({ visible, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [feeling, setFeeling] = useState('neutral');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle('');
    setFeeling('neutral');
    setText('');
    setSaving(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim() || !text.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), feeling, text: text.trim() });
      reset();
    } catch (error) {
      showError('Could not save the entry', error);
      setSaving(false);
    }
  };

  const canSave = title.trim().length > 0 && text.trim().length > 0 && !saving;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <Text style={styles.heading}>New entry</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />

          <Text style={styles.label}>How do you feel today?</Text>
          <View style={styles.feelingsRow}>
            {FEELINGS.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.feelingOption,
                  feeling === f.key && styles.feelingSelected,
                ]}
                onPress={() => setFeeling(f.key)}
              >
                <Text style={styles.feelingEmoji}>{f.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Write about your day..."
            placeholderTextColor={COLORS.textLight}
            value={text}
            onChangeText={setText}
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  feelingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  feelingOption: {
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  feelingSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surface,
  },
  feelingEmoji: {
    fontSize: 28,
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  cancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  cancelText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  saveDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

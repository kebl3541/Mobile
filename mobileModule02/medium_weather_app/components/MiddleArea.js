import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MiddleArea({ title, extraText, responsive, tone = 'default' }) {
  const { middleText, middlePadH } = responsive;
  const bodyStyle = [
    styles.body,
    tone === 'error' && styles.bodyError,
  ];

  return (
    <View style={[styles.container, { paddingHorizontal: middlePadH }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { fontSize: middleText }]}> 
          {title}
        </Text>
        {extraText ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={bodyStyle}>
              {extraText}
            </Text>
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  scroll: {
    width: '100%',
    maxHeight: '68%',
  },
  scrollContent: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  body: {
    width: '100%',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21,
  },
  bodyError: {
    color: '#d32f2f',
  },
});
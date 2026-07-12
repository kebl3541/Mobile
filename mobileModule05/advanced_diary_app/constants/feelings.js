export const FEELINGS = [
  { key: 'very_happy', emoji: '😄', label: 'Very happy' },
  { key: 'happy', emoji: '🙂', label: 'Happy' },
  { key: 'neutral', emoji: '😐', label: 'Neutral' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'angry', emoji: '😡', label: 'Angry' },
];

export function feelingByKey(key) {
  return FEELINGS.find((f) => f.key === key) ?? FEELINGS[2];
}

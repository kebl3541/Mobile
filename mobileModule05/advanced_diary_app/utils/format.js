// Firestore Timestamp -> "Jul 11, 2026 at 14:32"
export function formatDate(timestamp) {
  if (!timestamp?.toDate) return '';
  const d = timestamp.toDate();
  const date = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date} at ${time}`;
}

// Firestore Timestamp -> "2026-07-12" (local time), the key format
// used by react-native-calendars.
export function dateKey(timestamp) {
  if (!timestamp?.toDate) return null;
  const d = timestamp.toDate();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

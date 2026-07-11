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

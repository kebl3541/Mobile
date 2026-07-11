import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

import { db } from './firebase';

const ENTRIES = 'entries';

// Live subscription to the current user's entries, newest first.
// Sorting happens client-side so no composite Firestore index is needed.
export function subscribeToEntries(usermail, onChange, onError) {
  const q = query(collection(db, ENTRIES), where('usermail', '==', usermail));
  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.date?.seconds ?? 0) - (a.date?.seconds ?? 0));
      onChange(entries);
    },
    onError
  );
}

export function createEntry({ usermail, title, feeling, text }) {
  return addDoc(collection(db, ENTRIES), {
    usermail,
    title,
    feeling,
    text,
    date: Timestamp.now(),
  });
}

export function deleteEntry(entryId) {
  return deleteDoc(doc(db, ENTRIES, entryId));
}

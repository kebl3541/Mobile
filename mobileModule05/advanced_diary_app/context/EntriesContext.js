import React, { createContext, useContext, useEffect, useState } from 'react';

import { useAuth } from './AuthContext';
import { subscribeToEntries } from '../services/diaryService';

// One Firestore subscription shared by every screen (Profile and Agenda
// both stay mounted in the tab navigator, so per-screen subscriptions
// would run twice).
const EntriesContext = createContext(null);

export function EntriesProvider({ children }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    if (!user?.email) {
      setEntries(null);
      return undefined;
    }
    const unsubscribe = subscribeToEntries(
      user.email,
      setEntries,
      (error) => console.error('Entries subscription error:', error)
    );
    return unsubscribe;
  }, [user?.email]);

  return (
    <EntriesContext.Provider value={entries}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntriesContext() {
  return useContext(EntriesContext);
}

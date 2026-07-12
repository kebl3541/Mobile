import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { subscribeToEntries } from '../services/diaryService';

// Live entries for the signed-in user. null while the first snapshot
// is loading.
export function useEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    if (!user?.email) return undefined;
    const unsubscribe = subscribeToEntries(
      user.email,
      setEntries,
      (error) => console.error('Entries subscription error:', error)
    );
    return unsubscribe;
  }, [user?.email]);

  return entries;
}

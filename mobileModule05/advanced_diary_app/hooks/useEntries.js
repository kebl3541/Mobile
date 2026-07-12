import { useEntriesContext } from '../context/EntriesContext';

// Live entries for the signed-in user, shared by Profile and Agenda.
// null while the first snapshot is loading. Backed by the single
// subscription in EntriesProvider.
export function useEntries() {
  return useEntriesContext();
}

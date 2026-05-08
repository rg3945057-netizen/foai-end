// Thin wrapper — reads from ISSContext so there is ONE polling source for the whole app
import { useISSContext } from '@/context/ISSContext';
export function useISSData() { return useISSContext(); }

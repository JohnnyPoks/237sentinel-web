import { useSyncExternalStore } from "react";

import { getWarmState, subscribeWarmState, type WarmState } from "./api";

/** Reactive view of the backend warm-up state (see api.ts). */
export function useWarmState(): WarmState {
  return useSyncExternalStore(subscribeWarmState, getWarmState, getWarmState);
}

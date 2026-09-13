import type { CallSimulationState } from "@/types";

export interface CallHistoryPort {
  addCall(call: CallSimulationState): void;
  getCalls(): CallSimulationState[];
  getCallById(callId: string): CallSimulationState | undefined;
  updateCall(callId: string, updater: (call: CallSimulationState) => CallSimulationState): CallSimulationState | undefined;
}

export function sanitizeCallForPersistence(call: CallSimulationState): CallSimulationState {
  return {
    ...call,
    personalIdInput: "",
  };
}

export class LocalCallHistoryService implements CallHistoryPort {
  private static storageKey = "ai-contact-center:call-history";

  private read(): CallSimulationState[] {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(LocalCallHistoryService.storageKey);

    return raw ? (JSON.parse(raw) as CallSimulationState[]) : [];
  }

  private write(calls: CallSimulationState[]) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LocalCallHistoryService.storageKey, JSON.stringify(calls));
    }
  }

  addCall(call: CallSimulationState): void {
    const sanitized = sanitizeCallForPersistence(call);
    const current = this.read();
    const next = [sanitized, ...current.filter((item) => item.callId !== sanitized.callId)];
    this.write(next);
  }

  getCalls(): CallSimulationState[] {
    return this.read();
  }

  getCallById(callId: string): CallSimulationState | undefined {
    return this.read().find((call) => call.callId === callId);
  }

  updateCall(
    callId: string,
    updater: (call: CallSimulationState) => CallSimulationState,
  ): CallSimulationState | undefined {
    const current = this.read();
    const index = current.findIndex((call) => call.callId === callId);

    if (index === -1) {
      return undefined;
    }

    const updated = sanitizeCallForPersistence(updater(current[index]));
    const next = [...current];
    next[index] = updated;
    this.write(next);

    return updated;
  }
}

export const callHistoryService = new LocalCallHistoryService();

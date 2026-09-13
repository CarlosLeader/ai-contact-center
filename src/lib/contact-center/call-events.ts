import type { CallEvent, CallEventType, CallSimulationState } from "@/types";

function formatTimestamp() {
  return new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function createCallEvent(
  callId: string,
  type: CallEventType,
  metadata?: Record<string, string | number | boolean>,
): CallEvent {
  const timestamp = formatTimestamp();

  return {
    id: `evt-${callId}-${timestamp}-${Math.random().toString(36).slice(2, 10)}`,
    callId,
    type,
    timestamp,
    ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
  };
}

export function appendCallEvent(
  call: CallSimulationState,
  type: CallEventType,
  metadata?: Record<string, string | number | boolean>,
): CallSimulationState {
  return {
    ...call,
    events: [...call.events, createCallEvent(call.callId, type, metadata)],
  };
}

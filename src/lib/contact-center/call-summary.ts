import type { CallSimulationState, CallSummary } from "@/types";

export function generateCallSummary(call: CallSimulationState): CallSummary {
  const transferred = call.status === "TRANSFERRED" || call.status === "TRANSFER_PENDING";

  const resolution =
    transferred
      ? "Transferred to a human agent."
      : call.intent === "Crear ticket"
        ? "Ticket created successfully."
        : "Customer informed about current request status.";

  return {
    callId: call.callId,
    callerId: call.callerId,
    customerName: call.customerName,
    verificationStatus: call.verificationStatus,
    intent: call.intent,
    duration: call.duration,
    resolution,
    transferred,
  };
}

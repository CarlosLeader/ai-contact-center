import type { CallSimulationState, CallStatus, ConversationMessage } from "@/types";

import { appendCallEvent, createCallEvent } from "@/lib/contact-center/call-events";
import { callHistoryService, sanitizeCallForPersistence } from "@/lib/contact-center/call-history";
import { generateCallSummary } from "@/lib/contact-center/call-summary";
import { type CRMPort, mockCRM } from "@/lib/contact-center/crm";
import { maskPersonalId, verifyCustomer } from "@/lib/contact-center/verification";

let nextCallSequence = 127;

function formatTimestamp() {
  return new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function createMessage(speaker: "AI" | "Caller", text: string): ConversationMessage {
  return {
    id: `${speaker}-${Math.random().toString(36).slice(2, 11)}`,
    speaker,
    text,
    timestamp: formatTimestamp(),
  };
}

function createDemoCustomer() {
  return {
    customerId: "CLI-10245",
    fullName: "Carlos Gómez",
    personalId: "00112345678",
    phone: "+1 809 555 1234",
    requestId: "REQ-98421",
    requestStatus: "En proceso",
    estimatedResolution: "15/09/2026",
  };
}

export function createDemoCall(): CallSimulationState {
  const callId = `CALL-${String(nextCallSequence).padStart(6, "0")}`;
  nextCallSequence += 1;

  const customer = createDemoCustomer();

  const call: CallSimulationState = {
    callId,
    callerId: customer.phone,
    customerName: customer.fullName,
    customerId: customer.customerId,
    status: "CALLING",
    verificationStatus: "PENDING",
    duration: "00:00",
    intent: "Customer identification",
    requestId: customer.requestId,
    attempts: 0,
    maxAttempts: 3,
    personalIdInput: "",
    conversation: [
      createMessage(
        "AI",
        "Bienvenido a AI Contact Center. Para continuar, ingrese su número de identificación utilizando el teclado.",
      ),
      createMessage("Caller", ""),
    ],
    events: [
      createCallEvent(callId, "CALL_STARTED", { callerId: customer.phone }),
      createCallEvent(callId, "CALLER_ID_CAPTURED", { callerId: customer.phone }),
    ],
  };

  callHistoryService.addCall(call);

  return call;
}

export function connectCall(call: CallSimulationState): CallSimulationState {
  const nextState = appendCallEvent(call, "CALL_CONNECTED");

  return {
    ...nextState,
    status: "CONNECTED",
    conversation: [...nextState.conversation, createMessage("AI", "Llamada conectada. Capturando Caller ID.")],
  };
}

export function requestIdentification(call: CallSimulationState): CallSimulationState {
  const nextState = appendCallEvent(call, "IDENTIFICATION_REQUESTED", { requestId: call.requestId });

  return {
    ...nextState,
    status: "IDENTIFICATION_REQUIRED",
    verificationStatus: "PENDING",
    conversation: [
      ...nextState.conversation,
      createMessage("AI", "Para continuar, ingrese su identificación personal utilizando el teclado."),
    ],
  };
}

export function appendDtmfInput(call: CallSimulationState, key: string): CallSimulationState {
  if (key === "⌫") {
    const nextValue = call.personalIdInput.slice(0, -1);

    return {
      ...call,
      personalIdInput: nextValue,
      conversation: [...call.conversation, createMessage("AI", "Esperando identificación...")],
    };
  }

  if (key === "✓") {
    return call;
  }

  const nextValue = `${call.personalIdInput}${key}`;

  return appendCallEvent(
    {
      ...call,
      personalIdInput: nextValue,
      conversation: [
        ...call.conversation,
        createMessage("Caller", `Personal ID entered (${maskPersonalId(nextValue)})`),
      ],
    },
    "DTMF_INPUT",
    { reference: maskPersonalId(nextValue) },
  );
}

export function submitPersonalId(call: CallSimulationState): CallSimulationState {
  const attemptNumber = (call.attempts ?? 0) + 1;
  const verificationStarted: CallSimulationState = {
    ...call,
    attempts: attemptNumber,
    status: "IDENTIFYING",
    verificationStatus: "VERIFYING",
    conversation: [...call.conversation, createMessage("AI", "Verificando identidad...")],
    events: [
      ...call.events,
      createCallEvent(call.callId, "IDENTITY_VERIFICATION_STARTED", {
        attempt: attemptNumber,
        maxAttempts: call.maxAttempts,
      }),
    ],
  };

  const result = verifyCustomer(call.callerId, call.personalIdInput, mockCRM);

  if (result.verificationStatus === "VERIFIED") {
    const customer = result.customer ?? mockCRM.findCustomer(call.customerId) ?? createDemoCustomer();

    const verifiedState: CallSimulationState = {
      ...verificationStarted,
      status: "AI_LISTENING",
      verificationStatus: "VERIFIED",
      intent: "Consulta de solicitud",
      customerName: customer.fullName,
      customerId: customer.customerId,
      requestId: customer.requestId,
      conversation: [
        ...verificationStarted.conversation,
        createMessage("AI", "Identidad verificada. ¿En qué puedo ayudarte?"),
      ],
      events: [
        ...verificationStarted.events,
        createCallEvent(call.callId, "IDENTITY_VERIFIED", { customerId: customer.customerId }),
        createCallEvent(call.callId, "AI_RESPONSE", { reference: "Customer verified" }),
      ],
    };

    return callHistoryService.updateCall(call.callId, () => verifiedState) ?? verifiedState;
  }

  if (result.verificationStatus === "ADDITIONAL_VERIFICATION") {
    const additionalVerificationState: CallSimulationState = {
      ...verificationStarted,
      status: "IDENTIFICATION_REQUIRED",
      verificationStatus: "ADDITIONAL_VERIFICATION",
      conversation: [
        ...verificationStarted.conversation,
        createMessage(
          "AI",
          "No pudimos confirmar la identidad con la información proporcionada. Confirme la información o solicite asistencia humana.",
        ),
      ],
      events: [
        ...verificationStarted.events,
        createCallEvent(call.callId, "IDENTITY_FAILED", {
          attempt: attemptNumber,
          maxAttempts: call.maxAttempts,
        }),
      ],
    };

    return callHistoryService.updateCall(call.callId, () => additionalVerificationState) ?? additionalVerificationState;
  }

  if (attemptNumber >= call.maxAttempts) {
    const failedState: CallSimulationState = {
      ...verificationStarted,
      status: "TRANSFER_PENDING",
      verificationStatus: "FAILED",
      conversation: [
        ...verificationStarted.conversation,
        createMessage("AI", "Identity verification failed. Transferring to a human agent."),
      ],
      events: [
        ...verificationStarted.events,
        createCallEvent(call.callId, "IDENTITY_FAILED", {
          attempt: attemptNumber,
          maxAttempts: call.maxAttempts,
        }),
        createCallEvent(call.callId, "TRANSFER_REQUESTED", { callId: call.callId }),
      ],
    };

    return callHistoryService.updateCall(call.callId, () => failedState) ?? failedState;
  }

  const retryState: CallSimulationState = {
    ...verificationStarted,
    status: "IDENTIFICATION_REQUIRED",
    verificationStatus: "FAILED",
    conversation: [
      ...verificationStarted.conversation,
      createMessage("AI", "No pudimos validar esa identificación. Intente nuevamente."),
    ],
    events: [
      ...verificationStarted.events,
      createCallEvent(call.callId, "IDENTITY_FAILED", {
        attempt: attemptNumber,
        maxAttempts: call.maxAttempts,
      }),
    ],
  };

  return callHistoryService.updateCall(call.callId, () => retryState) ?? retryState;
}

export function executeDemoIntent(
  call: CallSimulationState,
  intent: "Consultar solicitud" | "Crear ticket" | "Hablar con un agente" | "Finalizar llamada",
): CallSimulationState {
  if (call.verificationStatus !== "VERIFIED") {
    return call;
  }

  if (intent === "Consultar solicitud") {
    const request = mockCRM.getRequestStatus(call.customerId, call.requestId);

    const nextState = appendCallEvent(
      {
        ...call,
        status: "AI_LISTENING",
        intent: "Consultar solicitud",
        conversation: [...call.conversation, createMessage("AI", "Consultando solicitud...")],
      },
      "CRM_LOOKUP",
      { customerId: call.customerId, requestId: request.requestId },
    );

    const crmActionState = appendCallEvent(
      nextState,
      "CRM_ACTION",
      { requestId: request.requestId, customerId: call.customerId },
    );

    const summaryState: CallSimulationState = {
      ...crmActionState,
      status: "AI_SPEAKING",
      events: [
        ...crmActionState.events,
        createCallEvent(call.callId, "AI_RESPONSE", { reference: "Request status lookup" }),
      ],
      summary: generateCallSummary({
        ...call,
        intent: "Consultar solicitud",
      }),
    };

    return callHistoryService.updateCall(call.callId, () => summaryState) ?? summaryState;
  }

  if (intent === "Crear ticket") {
    const ticket = mockCRM.createTicket(call.customerId, "Customer requested support ticket");

    const nextState = appendCallEvent(
      {
        ...call,
        status: "AI_LISTENING",
        intent: "Crear ticket",
        conversation: [...call.conversation, createMessage("AI", `He creado el ticket ${ticket.ticketId}.`)],
      },
      "CRM_ACTION",
      { ticketId: ticket.ticketId, customerId: call.customerId },
    );

    const summaryState: CallSimulationState = {
      ...nextState,
      status: "AI_SPEAKING",
      events: [
        ...nextState.events,
        createCallEvent(call.callId, "AI_RESPONSE", { reference: `Ticket created: ${ticket.ticketId}` }),
      ],
      summary: generateCallSummary({
        ...call,
        intent: "Crear ticket",
      }),
    };

    return callHistoryService.updateCall(call.callId, () => summaryState) ?? summaryState;
  }

  if (intent === "Hablar con un agente") {
    const transferredState = appendCallEvent(
      {
        ...call,
        status: "TRANSFER_PENDING",
        intent: "Human agent",
        conversation: [
          ...call.conversation,
          createMessage("AI", "Transfiriendo llamada a un agente..."),
          createMessage("AI", "Call transferred"),
        ],
      },
      "TRANSFER_REQUESTED",
      { callId: call.callId },
    );

    const finalState: CallSimulationState = {
      ...appendCallEvent(transferredState, "CALL_TRANSFERRED", { target: "AG-001" }),
      status: "TRANSFERRED",
      summary: generateCallSummary({
        ...call,
        status: "TRANSFERRED",
        intent: "Human agent",
      }),
    };

    return callHistoryService.updateCall(call.callId, () => finalState) ?? finalState;
  }

  const endedState: CallSimulationState = {
    ...call,
    status: "CALL_ENDED",
    intent: "Finalizar llamada",
    conversation: [...call.conversation, createMessage("AI", "Llamada finalizada.")],
    events: [...call.events, createCallEvent(call.callId, "CALL_ENDED")],
    summary: generateCallSummary({
      ...call,
      status: "RESOLVED",
      intent: "Finalizar llamada",
    }),
  };

  return callHistoryService.updateCall(call.callId, () => endedState) ?? endedState;
}

export function resolveCall(call: CallSimulationState): CallSimulationState {
  const nextState: CallSimulationState = {
    ...call,
    status: "RESOLVED" as CallStatus,
    summary: generateCallSummary(call),
    conversation: [...call.conversation, createMessage("AI", "Resumen de llamada preparado.")],
    events: [...call.events, createCallEvent(call.callId, "CALL_ENDED")],
  };

  return callHistoryService.updateCall(call.callId, () => nextState) ?? nextState;
}

export function advanceCallFlow(call: CallSimulationState): CallSimulationState {
  switch (call.status) {
    case "CALLING":
      return connectCall(call);
    case "CONNECTED":
      return requestIdentification(call);
    default:
      return call;
  }
}

export function getCallHistory(): CallSimulationState[] {
  return callHistoryService.getCalls();
}

export function isLiveStatus(status: CallStatus) {
  return [
    "CALLING",
    "CONNECTED",
    "IDENTIFICATION_REQUIRED",
    "IDENTIFYING",
    "VERIFIED",
    "AI_LISTENING",
    "AI_PROCESSING",
    "AI_SPEAKING",
    "CRM_ACTION",
    "TRANSFER_PENDING",
    "TRANSFERRED",
    "RESOLVED",
  ].includes(status);
}

export { maskPersonalId, sanitizeCallForPersistence };

export function initializeCallEngine(crm: CRMPort = mockCRM) {
  return {
    createDemoCall,
    connectCall,
    requestIdentification,
    appendDtmfInput,
    submitPersonalId,
    executeDemoIntent,
    resolveCall,
    advanceCallFlow,
    getCallHistory,
    maskPersonalId,
    sanitizeCallForPersistence,
    crm,
  };
}

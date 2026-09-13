import { customerDemo } from "@/lib/mock/dashboard";
import type {
  CallEvent,
  CallSimulationState,
  CallStatus,
  CallSummary,
  ConversationMessage,
  Customer,
  VerificationStatus,
} from "@/types";

let nextCallSequence = 127;
let nextTicketSequence = 41;

const mockCustomers: Customer[] = [customerDemo];

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

function createEvent(event: string, reference?: string): CallEvent {
  return {
    timestamp: formatTimestamp(),
    event,
    reference,
  };
}

export function createDemoCall(): CallSimulationState {
  const callId = `CALL-${String(nextCallSequence).padStart(6, "0")}`;
  nextCallSequence += 1;

  return {
    callId,
    callerId: customerDemo.phone,
    customerName: customerDemo.fullName,
    customerId: customerDemo.customerId,
    status: "CALLING",
    verificationStatus: "PENDING",
    duration: "00:00",
    intent: "Customer identification",
    requestId: customerDemo.requestId,
    attempts: 0,
    maxAttempts: 3,
    personalIdInput: "",
    conversation: [
      createMessage("AI", "Bienvenido a AI Contact Center. Para continuar, ingrese su número de identificación utilizando el teclado."),
      createMessage("Caller", ""),
    ],
    events: [
      createEvent("CALL_STARTED", callId),
      createEvent("CALLER_ID_CAPTURED", customerDemo.phone),
    ],
  };
}

export function connectCall(call: CallSimulationState): CallSimulationState {
  return {
    ...call,
    status: "CONNECTED",
    conversation: [...call.conversation, createMessage("AI", "Llamada conectada. Capturando Caller ID.")],
    events: [...call.events, createEvent("CALL_CONNECTED", call.callId)],
  };
}

export function requestIdentification(call: CallSimulationState): CallSimulationState {
  return {
    ...call,
    status: "IDENTIFICATION_REQUIRED",
    verificationStatus: "PENDING",
    conversation: [
      ...call.conversation,
      createMessage("AI", "Para continuar, ingrese su identificación personal utilizando el teclado."),
    ],
    events: [...call.events, createEvent("IDENTIFICATION_REQUESTED", call.callId)],
  };
}

export function appendDtmfInput(
  call: CallSimulationState,
  key: string,
): CallSimulationState {
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

  return {
    ...call,
    personalIdInput: nextValue,
    conversation: [
      ...call.conversation,
      createMessage("Caller", `Personal ID entered (${maskPersonalId(nextValue)})`),
    ],
    events: [...call.events, createEvent("DTMF_INPUT", maskPersonalId(nextValue))],
  };
}

export function submitPersonalId(call: CallSimulationState): CallSimulationState {
  const attemptNumber = (call.attempts ?? 0) + 1;
  const verificationStarted: CallSimulationState = {
    ...call,
    attempts: attemptNumber,
    status: "IDENTIFYING",
    verificationStatus: "VERIFYING",
    conversation: [
      ...call.conversation,
      createMessage("AI", "Verificando identidad..."),
    ],
    events: [
      ...call.events,
      createEvent("IDENTITY_VERIFICATION_STARTED", `Attempt ${attemptNumber} of ${call.maxAttempts}`),
    ],
  };

  const result = identifyCustomer(call.callerId, call.personalIdInput);

  if (result.verificationStatus === "VERIFIED") {
    return {
      ...verificationStarted,
      status: "AI_LISTENING",
      verificationStatus: "VERIFIED",
      intent: "Consulta de solicitud",
      customerName: result.customer?.fullName ?? call.customerName,
      customerId: result.customer?.customerId ?? call.customerId,
      requestId: result.customer?.requestId ?? call.requestId,
      conversation: [
        ...verificationStarted.conversation,
        createMessage("AI", `Identidad verificada. ¿En qué puedo ayudarte?`),
      ],
      events: [
        ...verificationStarted.events,
        createEvent("IDENTITY_VERIFIED", result.customer?.customerId ?? call.customerId),
        createEvent("AI_RESPONSE", "Customer verified"),
      ],
    };
  }

  if (attemptNumber >= call.maxAttempts) {
    return {
      ...verificationStarted,
      status: "TRANSFER_PENDING",
      verificationStatus: result.verificationStatus === "ADDITIONAL_VERIFICATION" ? "ADDITIONAL_VERIFICATION" : "FAILED",
      conversation: [
        ...verificationStarted.conversation,
        createMessage("AI", "Identity verification failed. Transferring to a human agent."),
      ],
      events: [
        ...verificationStarted.events,
        createEvent("IDENTITY_FAILED", `Attempt ${attemptNumber} of ${call.maxAttempts}`),
        createEvent("TRANSFER_REQUESTED", call.callId),
      ],
    };
  }

  return {
    ...verificationStarted,
    status: "IDENTIFICATION_REQUIRED",
    verificationStatus: result.verificationStatus,
    conversation: [
      ...verificationStarted.conversation,
      createMessage(
        "AI",
        result.verificationStatus === "ADDITIONAL_VERIFICATION"
          ? "Se requiere verificación adicional. Confirme la información ingresada."
          : "No pudimos validar esa identificación. Intente nuevamente.",
      ),
    ],
    events: [
      ...verificationStarted.events,
      createEvent("IDENTITY_FAILED", `Attempt ${attemptNumber} of ${call.maxAttempts}`),
    ],
  };
}

export function identifyCustomer(
  callerPhone: string,
  personalId: string,
): {
  verificationStatus: VerificationStatus;
  customer?: Customer;
} {
  const customerByPhone = mockCustomers.find((customer) => customer.phone === callerPhone);
  const customerByPersonalId = mockCustomers.find((customer) => customer.personalId === personalId);

  if (!customerByPhone && !customerByPersonalId) {
    return { verificationStatus: "FAILED" };
  }

  if (customerByPhone && customerByPersonalId && customerByPhone.customerId === customerByPersonalId.customerId) {
    return { verificationStatus: "VERIFIED", customer: customerByPhone };
  }

  if (customerByPersonalId && !customerByPhone) {
    return { verificationStatus: "ADDITIONAL_VERIFICATION", customer: customerByPersonalId };
  }

  if (customerByPhone && !customerByPersonalId) {
    return { verificationStatus: "FAILED", customer: customerByPhone };
  }

  return { verificationStatus: "FAILED", customer: customerByPhone ?? customerByPersonalId };
}

export function getRequestStatus(customerId: string, requestId: string) {
  const request = mockCustomers.find((customer) => customer.customerId === customerId);

  if (!request) {
    return {
      requestId,
      customerId,
      requestType: "Consulta de solicitud",
      status: "En proceso",
      estimatedResolution: customerDemo.estimatedResolution,
    };
  }

  return {
    requestId: request.requestId,
    customerId: request.customerId,
    requestType: "Consulta de solicitud",
    status: request.requestStatus,
    estimatedResolution: request.estimatedResolution,
  };
}

export function createTicket(customerId: string, reason: string) {
  nextTicketSequence += 1;

  return {
    ticketId: `TCK-${String(nextTicketSequence).padStart(5, "0")}`,
    customerId,
    title: reason,
    status: "OPEN",
  };
}

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

export function executeDemoIntent(
  call: CallSimulationState,
  intent: "Consultar solicitud" | "Crear ticket" | "Hablar con un agente" | "Finalizar llamada",
): CallSimulationState {
  if (call.verificationStatus !== "VERIFIED") {
    return call;
  }

  if (intent === "Consultar solicitud") {
    const request = getRequestStatus(call.customerId, call.requestId);

    return {
      ...call,
      status: "AI_SPEAKING",
      intent: "Consultar solicitud",
      conversation: [
        ...call.conversation,
        createMessage("AI", "Consultando solicitud..."),
      ],
      events: [
        ...call.events,
        createEvent("CRM_LOOKUP", request.requestId),
        createEvent("CRM_ACTION", request.requestId),
        createEvent("AI_RESPONSE", "Request status lookup"),
      ],
      summary: generateCallSummary({
        ...call,
        intent: "Consultar solicitud",
      }),
    };
  }

  if (intent === "Crear ticket") {
    const ticket = createTicket(call.customerId, "Customer requested support ticket");

    return {
      ...call,
      status: "AI_SPEAKING",
      intent: "Crear ticket",
      conversation: [
        ...call.conversation,
        createMessage("AI", `He creado el ticket ${ticket.ticketId}.`),
      ],
      events: [
        ...call.events,
        createEvent("CRM_ACTION", ticket.ticketId),
        createEvent("AI_RESPONSE", `Ticket created: ${ticket.ticketId}`),
      ],
      summary: generateCallSummary({
        ...call,
        intent: "Crear ticket",
      }),
    };
  }

  if (intent === "Hablar con un agente") {
    return {
      ...call,
      status: "TRANSFERRED",
      intent: "Human agent",
      conversation: [
        ...call.conversation,
        createMessage("AI", "Transfiriendo llamada a un agente..."),
        createMessage("AI", "Call transferred"),
      ],
      events: [
        ...call.events,
        createEvent("TRANSFER_REQUESTED", call.callId),
        createEvent("CALL_TRANSFERRED", "AG-001"),
      ],
      summary: generateCallSummary({
        ...call,
        status: "TRANSFERRED",
        intent: "Human agent",
      }),
    };
  }

  return {
    ...call,
    status: "CALL_ENDED",
    intent: "Finalizar llamada",
    conversation: [
      ...call.conversation,
      createMessage("AI", "Llamada finalizada."),
    ],
    events: [...call.events, createEvent("CALL_ENDED", call.callId)],
    summary: generateCallSummary({
      ...call,
      status: "RESOLVED",
      intent: "Finalizar llamada",
    }),
  };
}

export function resolveCall(call: CallSimulationState): CallSimulationState {
  const nextState = {
    ...call,
    status: "RESOLVED",
    summary: generateCallSummary(call),
    conversation: [
      ...call.conversation,
      createMessage("AI", "Resumen de llamada preparado."),
    ],
    events: [...call.events, createEvent("CALL_ENDED", call.callId)],
  };

  return {
    ...nextState,
    status: "CALL_ENDED",
  };
}

export function maskPersonalId(value: string) {
  if (!value) return "";

  if (value.length <= 4) {
    return `${value.slice(0, 2)}••••`;
  }

  return `${value.slice(0, 4)}••••${value.slice(-2)}`;
}

export function isLiveStatus(status: CallStatus) {
  return ["CALLING", "CONNECTED", "IDENTIFICATION_REQUIRED", "IDENTIFYING", "VERIFIED", "AI_LISTENING", "AI_PROCESSING", "AI_SPEAKING", "CRM_ACTION", "TRANSFER_PENDING", "TRANSFERRED", "RESOLVED"].includes(status);
}

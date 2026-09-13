export type CallStatus =
  | "CALLING"
  | "CONNECTED"
  | "IDENTIFICATION_REQUIRED"
  | "IDENTIFYING"
  | "CRM_LOOKUP"
  | "VERIFIED"
  | "AI_LISTENING"
  | "AI_PROCESSING"
  | "AI_SPEAKING"
  | "CRM_ACTION"
  | "TRANSFER_PENDING"
  | "TRANSFERRED"
  | "RESOLVED"
  | "CALL_ENDED"
  | "FAILED"
  | "ABANDONED";

export type VerificationStatus =
  | "PENDING"
  | "VERIFYING"
  | "VERIFIED"
  | "ADDITIONAL_VERIFICATION"
  | "FAILED"
  | "EXPIRED";

export type CallEventType =
  | "CALL_STARTED"
  | "CALL_CONNECTED"
  | "CALLER_ID_CAPTURED"
  | "IDENTIFICATION_REQUESTED"
  | "DTMF_INPUT"
  | "IDENTITY_VERIFICATION_STARTED"
  | "IDENTITY_VERIFIED"
  | "IDENTITY_FAILED"
  | "CRM_LOOKUP"
  | "CRM_ACTION"
  | "AI_RESPONSE"
  | "TRANSFER_REQUESTED"
  | "CALL_TRANSFERRED"
  | "CALL_ENDED";

export interface Customer {
  customerId: string;
  fullName: string;
  personalId: string;
  phone: string;
  requestId: string;
  requestStatus: string;
  estimatedResolution: string;
}

export interface Request {
  requestId: string;
  customerId: string;
  requestType: string;
  status: string;
  estimatedResolution: string;
}

export interface Ticket {
  ticketId: string;
  customerId: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: "ONLINE" | "BUSY" | "OFFLINE";
}

export interface Call {
  callId: string;
  callerId: string;
  customerName: string;
  customerId: string;
  status: CallStatus;
  verificationStatus: VerificationStatus;
  duration: string;
  intent: string;
  requestId: string;
}

export interface ConversationMessage {
  id: string;
  speaker: "AI" | "Caller";
  text: string;
  timestamp: string;
}

export interface CallSimulationState extends Call {
  attempts: number;
  maxAttempts: number;
  personalIdInput: string;
  conversation: ConversationMessage[];
  events: CallEvent[];
  summary?: CallSummary;
}

export interface CallEvent {
  id: string;
  callId: string;
  type: CallEventType;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface CallSummary {
  callId: string;
  callerId: string;
  customerName: string;
  verificationStatus: VerificationStatus;
  intent: string;
  duration: string;
  resolution: string;
  transferred: boolean;
}

export interface KpiMetric {
  title: string;
  value: string;
  icon: string;
}
